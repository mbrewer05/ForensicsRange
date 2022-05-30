import json
import boto3
import time

REGION = 'us-west-2'
ddb = boto3.resource('dynamodb', region_name=REGION)
ssm = boto3.client('ssm', region_name=REGION)

def handler(event, context):
  print('received event:')
  print(event)

  email = event['requestContext']['authorizer']['claims']['email']
  print(email)

  table = ddb.Table('forensics-users-test')

  response = table.get_item(Key={'user-email': email})

  inst_id = response['Item']['inst_id']

  response = ssm.send_command(
      InstanceIds=[inst_id],
      DocumentName="AWS-RunPowerShellScript",
      Parameters={
          'commands': ['Tasklist /fi "imagename eq autopsy64.exe"']
      })
  
  command_id = response['Command']['CommandId']
  print(response)
  print(command_id)
  time.sleep(2)
  output = ssm.get_command_invocation(
      CommandId=command_id,
      InstanceId=inst_id
  )

  print(output)

  content = output['StandardOutputContent']
 
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(content)
  }