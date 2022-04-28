// import React from 'react'
import { API, Auth } from 'aws-amplify';
import DynamoDB  from 'aws-sdk/clients/dynamodb';

var status = 0;
export function getProgress(){
    var status =0;
    // //const token = user.signInUserSession.idToken.jwtToken
    // const db = new DynamoDB({
    //     region:"us-west-2",
    //     credentials:Auth.essentialCredentials(credentials)

    // });
    //Grab logged in user credentials
    // var user = '';
    // Auth.currentUserInfo().then(response => {
    //     user = JSON.stringify(response['username']);
    //     console.log(user);
    // });
    // console.log("Out");
    // console.log(user);
    // let user;
    // var params;

    // Auth.currentUserInfo().then(response => {
    //     console.log(JSON.stringify(response['username']));
    //     user = JSON.stringify(response['username']);
    //     // return JSON.stringify(response['username']);

        
    // });


    // var pleaseWork = Auth.currentUserInfo();
    // console.log(pleaseWork);
    // console.log(JSON.stringify(pleaseWork['username']));
    // console.log(JSON.stringify(pleaseWork));
    // var imBegging = JSON.stringify(pleaseWork['username']);
    // var username =user;
    // console.log(user);

    // var params = {
    //     TableName: 'forensics-users-test',
    //     KeyConditionExpression: "#user = :name",
    //     ExpressionAttributeNames: {
    //         "#user":"user-email"
    //     },
    //     ExpressionAttributeValues: {
    //         ":name" : {"S" : user}
    //     }


    // }
    Auth.currentUserInfo().then(response => {
        var params = {
            TableName: 'forensics-users-test',
            KeyConditionExpression: "#user = :name",
            ExpressionAttributeNames: {
                "#user":"user-email"
            },
            ExpressionAttributeValues: {
                ":name" : {"S" : (response['username'])}
            }
    
    
        }
        console.log(params);
        Auth.currentCredentials()
            .then(credentials => {
            const db= new DynamoDB({
                region: "us-west-2",
                credentials: Auth.essentialCredentials(credentials)
            });
            db.query(params, function(err, data) {
                if (err) {
                console.log(err);
                return null;
                } else {
            
                console.log('Got data');
                console.log(data);

                // for (var i in data['Items']) {
                //     // read the values from the dynamodb JSON packet
                //     var tempRead = parseFloat(data['Items'][i]['temperature']['N']);
                //     var timeStamp = parseInt(data['Items'][i]['ts']['N']);
                //     var timeRead = new Date(timeStamp);	
                //     console.log(timeRead);
                //     console.log(tempRead);        
                //     }
                }     
            })      
        });
    })

    return status += 10;
}
