import { Auth } from 'aws-amplify';
import {UpdateCommand} from "@aws-sdk/lib-dynamodb"
import { ddbDocClient } from './ddbDocClient';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


const REGION = "us-west-2";

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const translateConfig = {marshallOptions , unmarshallOptions}

export async function updateProgress(callback){
    let userInfo = await Auth.currentCredentials();
    let creds = await Auth.essentialCredentials(userInfo);
    const client = new DynamoDBClient({region:  REGION, credentials: creds});
    const docclient = DynamoDBDocumentClient.from(client,translateConfig);
    

    const user = {
        useremail : { S: "srmckee@calpoly.edu"},
    };

    var params = {
        TableName: 'forensics-users-test',
        Key: {"user-email" : user.useremail},
        UpdateExpression: 'set #user.has_post_it = :u',
        ExpressionAttributeNames: {
            "#user":"user-email"
        },
        ExpressionAttributeValues: {
            ":u" : "true",
            ":name" : {"S" : (userInfo['username'])}
        }
    }
    let testvar = new UpdateCommand(params);
    console.log(docclient);
    try{
        const data = await docclient.send(testvar);
        console.log("Success - item added or updates",data);
        callback(data);
    }catch(err){
        console.log("Error in update",err);
    }
}

// export async function updateProgress(callback){
//     let userInfo = await Auth.currentUserInfo();
//     var params = {
//         TableName: 'forensics-users-test',
//         Key: "#user = :name",
//         UpdateExpression: 'set #user.has_post_it = :u',
//         ExpressionAttributeNames: {
//             "#user":"user-email"
//         },
//         ExpressionAttributeValues: {
//             ":u" : true,
//             ":name" : {"S" : (userInfo['username'])}
//         }
//     }

//     let creds = await Auth.currentCredentials();

//     const db = new DynamoDB({
//         region: "us-west-2",
//         credentials: Auth.essentialCredentials(creds)
//     });

//     db.updateItem(params, function(err,dbData) {
//         if(err){
//             console.log("Caught in update");
//             console.log(err);
//         }else{
//             console.log("No err");
//             console.log(dbData);

//             callback();
//         }
//     })
// }