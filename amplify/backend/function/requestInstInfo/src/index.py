import json
import boto3

def handler(event, context):

  REGION = 'us-west-2'
  ddb = boto3.resource('dynamodb', region_name=REGION)
  ec2 = boto3.resource('ec2')
  
  email = event['requestContext']['authorizer']['claims']['email']
  
  #DynamoDB table Name
  table = ddb.Table('forensics-users-test')
  
  #use email as the primary key to get the DDB item/entry
  response = table.get_item(Key={'user-email': email})

  
  inst_id = response['Item']['inst_id']

  running_instances = ec2.instances.filter(InstanceIds=[inst_id])
    
  
  #should just print 1 ip
  ip = None
  #Currently, should only have once instance per user.
  for instance in running_instances:
    print("IP is ", instance.public_ip_address)
    ip = instance.public_ip_address
  
  if (ip):
    print(ip)
    ret_dict = {"ip": ip,
            "password": "3CUuX(=wD$dN3=eq)87CpXJZMl4lYx=Z"}
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
        },
        'body': json.dumps(ret_dict)
    }
  else:
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS'
        },
        'body': json.dumps("Hold your horses amigo...")
    }