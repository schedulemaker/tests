# tests
A unit and load testing harness Lambda function.

#### Tests passed to the Lambda harness should be in the following JSON format
```
{
    "functionName": <FUNCTION_NAME>,
    "qualifier": <VERSION NUMBER OR ALIAS>
    "tests": [
      {
        "testName": <NAME_OR_DESCRIPTION>,
        "timeout": 10, # In seconds, defaults to 10
        "runs": 1, # Number of times to run the test, default is once
        "payload": {}, # Put payload here
        "expected": {} # Put expected output here
      }
      # More tests
    ]
}
```
