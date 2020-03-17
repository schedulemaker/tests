
#Caching module to handle the state of imports
def __check(var):
    return True if var not in locals() and var not in globals() else False

if __check('aws'):
    import boto3 as aws

if __check('client'):
    client = aws.client('lambda')
