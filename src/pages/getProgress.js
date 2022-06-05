// import React from 'react'
import { API, Auth } from 'aws-amplify';
import DynamoDB  from 'aws-sdk/clients/dynamodb';

export async function getProgress(callback){
    //See Progress.js for specifics on the index's
    let progressArray = [0,0,0,0];

    //Check to see if autopsy is running
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;
    
    const requestInfo = {headers: { Authorization: token }};
    const autopsy_data = await API.get('forensicsrangeapi', '/checkInstAutopsy', requestInfo);

    let userInfo = await Auth.currentUserInfo();
    var params = {
        TableName: 'forensics-users-test',
        KeyConditionExpression: "#user = :name",
        ExpressionAttributeNames: {
            "#user":"user-email"
        },
        ExpressionAttributeValues: {
            ":name" : {"S" : (userInfo['attributes']['email'])}
        }
    }
    let creds = await Auth.currentCredentials();
    const db = new DynamoDB({
        region: "us-west-2",
        credentials: Auth.essentialCredentials(creds)
    });
    
    db.query(params, function(err, dbData) {
        let pNum = 0; //Total progress out of 100

        if (err) {
        console.log(err);
        return null;
        } else {      
            var items = (dbData['Items']);
            var hasPostIt = (items['0']['has_post_it']['BOOL']);
            var hasUSB = (items['0']['has_usb']['BOOL']);
            if(hasPostIt){
                progressArray[1] = 1;
                pNum += 29;
            }
            if(hasUSB){
                progressArray[2] = 1;
                pNum+= 29;
            }
            if (autopsy_data.includes("autopsy")){
                progressArray[3] = 1;
                pNum += 29;
            }
            progressArray[0] = pNum;
            callback(progressArray);
        }     
    }) 
}


// export function getProgress(){
//     var pNum =0;
//     var status;
    

//     status = Auth.currentUserInfo().then(async response => {
//         var params = {
//             TableName: 'forensics-users-test',
//             KeyConditionExpression: "#user = :name",
//             ExpressionAttributeNames: {
//                 "#user":"user-email"
//             },
//             ExpressionAttributeValues: {
//                 ":name" : {"S" : (response['username'])}
//             }
    
    
//         }
//         // console.log(params);
//         const credentials = await Auth.currentCredentials();
//         const db = new DynamoDB({
//             region: "us-west-2",
//             credentials: Auth.essentialCredentials(credentials)
//         });
//         db.query(params, function (err, dbData) {
//             if (err) {
//                 console.log(err);
//                 return null;
//             } else {
//                 console.log(dbData);
//                 var items = (dbData['Items']);
//                 var hasPostIt = (items['0']['has_post_it']['BOOL']);
//                 var hasUSB = (items['0']['has_usb']['BOOL']);
//                 if (hasPostIt) {
//                     pNum += 50;
//                     console.log("USER HAS POST IT");
//                 } else {
//                     console.log("USER DOES NOT HAVE POST IT");
//                 }
//                 if (hasUSB) {
//                     pNum += 50;
//                     console.log("USER HAS USB");
//                 } else {
//                     console.log("USER DOES NOT HAVE USB");
//                 }

//                 console.log("Status is " + pNum);
//                 return dbData;
//             }
//         });
//     });


//     status.then(function(val) {
//         console.log(val);
//     });

//     console.log(status);
//     return status;
// }
