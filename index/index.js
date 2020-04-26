if (typeof(cache) === 'undefined'){
    var cache = require('./cache');
}



module.exports.handler = async function({functionName, qualifier='$LATEST', tests}, context){
    let results = [];
    await Promise.all(tests.map(test => runTest(functionName, qualifier, test, results)));
    await logTests(results);
    return results;
}


async function runTest(functionName, qualifier, {testName, timeout=10, runs=1, payload, expected}, results){
    await Promise.all([...Array(runs).keys()].map(async index => {
        let result = null;
        const params = {
            FunctionName: functionName,
            Qualifier: qualifier,
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(payload)
        }
        console.log(`Running test <${testName}> on function <${functionName}>...`)
        const start = process.hrtime();
        try {
            const response = await cache.Lambda.invoke(params).promise();
            const end = process.hrtime(start);
            console.log(`Test took ${end[0]}s, ${end[1] / 1e6}ms`);
            result = testResult(response, expected);
        } catch (error) {
            console.log(`Error running test: ${error.message}`);
            result = {
                error: error.message
            };
        }
        logResult(results, functionName, qualifier, testName, index, timeout, payload, expected, result);
    }));
}

function testResult(response, expected){
    if (response.StatusCode !== 200){
        console.log(`Error running test: received response code ${response.StatusCode}`);
        return {
            error: response
        };
    }
    try {
        cache.assert.deepStrictEqual(JSON.parse(response.Payload), expected);
        return {
            successResult: 'true'
        };
    } catch (error) {
        console.log(`Test failed: ${error.message}`);
        return {
            failedResult: error.message
        };
    }
}

function logResult(results, functionName, qualifier, testName, run, timeout, payload, expected, result){
    results.push({
        functionName: functionName,
        qualifier: qualifier,
        testName: testName,
        run: run,
        timeout: timeout,
        payload: payload,
        expected: expected,
        timestamp: new Date().toISOString(),
        testId: cache.uuidv4(),
        ...result
    });
}
    

async function logTests(results){
    const items = results.map(res => {
        return {
            PutRequest: {
                Item: res
            }
        };
    });
    let index = 0;
    do {
        const params = {
            RequestItems: {
                [process.env.TABLENAME]: items.slice(index, index + 25)
            }
        }
        try{
            await cache.DocClient.batchWrite(params).promise();
        } catch(error){
            console.log(`Unable to log test results to database: ${error.message}`);
        }
        index += 25;
    } while (index < items.length);
}