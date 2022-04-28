// pages/Progress.js

import React from "react";
// import Progressbar from './progressBar';
import ProgressBar from './progressBar';
import {getProgress} from './getProgress';
import { Auth } from 'aws-amplify';

class Progress extends React.Component {
    constructor(props){
        super(props);
        this.increaseProgress = this.increaseProgress.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUserProgress = this.getUserProgress.bind(this);
    }
    curProgress = 0;

    increaseProgress(){
        var progress = this.curProgress;
        //alert(this.curProgress);
        progress = progress + 10;
        if(progress > 100){
            progress = progress % 100;
        }

        // I have no idea why I need both of these but I do so whatever 
        this.curProgress = progress;
        this.setState({curProgress: progress});
    }
    
    getUser(){
        // fetch(Auth.currentUserInfo())
        //     .then((response) => response.json());

        // console.log(reponse);
        let userInfo = Auth.currentUserInfo();

        Auth.currentUserInfo().then(response => {
            console.log(response);
            const json = JSON.stringify(response);
            const user = JSON.stringify(response['username']);
            console.log(json);
            console.log(user);
        });

        // let userInfoJson = userInfo.json();
        // for (var i in userInfo['<pending>']){
        //     //Just print whatever is returned
        //     console.log("Trying to log");
        //     console.log(i);
        // }
        //Assuming that to reach this page a user has to be signed in?
        
        // for(var i in )
        //console.log(Auth.currentUserInfo());
    }

    getUserProgress(){
        console.log(getProgress());
    }

    render() {
        return (
            <div>
                <h1 className="title1">Progress</h1>
                <p>Progress PAGE</p>
                <p>Scenario1</p>
                <div className="progress">           
                    {/* <ProgressBar id = "scenario1Progress" done={getProgress()}/> */}
                    <ProgressBar id = "scenario1Progress" done={this.curProgress}/>
                
                </div>
                <button onClick={this.increaseProgress}>Increase</button>
                Cur Progress is {this.curProgress}   
                <p>Scenario2</p>
                <button onClick={this.getUserProgress}>Log Info</button>
                <p>Scenario3</p>
                <button onClick={this.getUser}>Get User</button>
            </div>
        );
    }
}

// var curProgress = document.getElementById("scenario1Progress");

// function increaseProgress(){
//     // var a = setInterval(function() {
//     //     curProgress.done = curProgress.done + 1;

//     //     if(curProgress.value > 100){
//     //         clearInterval(a);
//     //     }
//     // }, 25);
// }

// const progress = document.querySelector('.progress-done');

// progress.getElementsByClassName.width = progress.getAttribute('data-done') + '%';
// progress.getElementsByClassName.opacity = 1;

export default Progress;