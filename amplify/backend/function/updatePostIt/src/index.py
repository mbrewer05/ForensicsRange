import json
import boto3

def handler(event, context):
  REGION = 'us-west-2'
  ddb = boto3.resource('dynamodb', region_name=REGION)

  
  email = event['requestContext']['authorizer']['claims']['email']
  #DynamoDB table Name
  table = ddb.Table('forensics-users-test')
  
  #use email as the primary key to get the DDB item/entry
  response = table.update_item(Key={'user-email': email}, UpdateExpression="SET has_post_it=:h", ExpressionAttributeValues={':h': True}, ReturnValues="UPDATED_NEW")


  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
      },
      'body': json.dumps(response)
  }