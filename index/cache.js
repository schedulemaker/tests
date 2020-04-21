
function check(v){
    return typeof(v) === 'undefined';
}

if (check(AWS)){
    var AWS = require('aws-sdk');
}

if (check(Lambda)){
    var Lambda = new AWS.Lambda();
}

if (check(DocClient)){
    var DocClient = new AWS.DynamoDB.DocumentClient();
}

if (check(uuidv4)){
    var {v4: uuidv4} = require('uuid');
}

if (typeof(assert) === 'undefiend'){
    var assert = require('assert');
}

module.exports = {
    Lambda: Lambda,
    DocClient: DocClient,
    uuidv4: uuidv4,
    assert: assert
}