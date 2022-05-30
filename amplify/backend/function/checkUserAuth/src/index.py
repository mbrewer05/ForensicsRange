import json
import boto3

def handler(event, context):
    REGION = 'us-west-2'
    ddb = boto3.resource('dynamodb', region_name=REGION)

    email = event['requestContext']['authorizer']['claims']['email']

    # #DynamoDB table Name
    table = ddb.Table('forensics-users-test')

    #use email as the primary key to get the DDB item/entry
    response = table.get_item(Key={'user-email': email})

    if 'Item' in response.keys():
        json_response = {"authorization_status": 'true'}
    else:
        json_response = {"authorization_status": 'false'}
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
        },
        'body': json.dumps(json_response)
    }