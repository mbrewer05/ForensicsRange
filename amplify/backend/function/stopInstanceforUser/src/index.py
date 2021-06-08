import json
import boto3
from collections import defaultdict

REGION = 'us-west-2'
ddb = boto3.resource('dynamodb', region_name=REGION)
ec2 = boto3.resource('ec2')

def handler(event, context):
    print('received event:')
    #print(event['requestContext']['authorizer']['claims']['email'])
    
    email = event['requestContext']['authorizer']['claims']['email']
    
    #DynamoDB table Name
    table = ddb.Table('forensics-users-test')
    
    #use email as the primary key to get the DDB item/entry
    response = table.get_item(Key={'user-email': email})
    
    
    inst_id = response['Item']['inst_id']
    
    response = ec2.instances.filter(InstanceIds=[inst_id]).terminate()
    
    
    
    
    if (response):
        return {
          'statusCode': 200,
          'headers': {
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
          },
          'body': response
        }
    else:
        return {
            'statusCode': 503,
            'headers': {
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
            },
            'body': "Instance Not Found"
        }