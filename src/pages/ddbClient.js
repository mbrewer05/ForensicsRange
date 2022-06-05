import { Auth } from 'aws-amplify';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export const REGION = "us-west-2";
//let creds = await Auth.currentCredentials();
export const ddbClient = new DynamoDBClient({region: REGION});