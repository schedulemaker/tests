
function check(v){
    return typeof(v) === 'undefined';
}

if (check(AWS)){
    var AWS = require('aws-sdk');
}

if (check(lambda)){
    var lambda = new AWS.Lambda();
}

if (check(docClient)){
    var docClient = new AWS.DynamoDB.DocumentClient();
}

if (check(uuidv4)){
    var {v4: uuidv4} = require('uuid');
}

if (check(assert)){
    var assert = require('assert');
}

module.exports = {
    Lambda: lambda,
    DocClient: docClient,
    uuidv4: uuidv4,
    assert: assert
}