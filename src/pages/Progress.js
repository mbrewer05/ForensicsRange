// pages/Progress.js

import React from "react";
// import Progressbar from './progressBar';
import ProgressBar from './progressBar';
import {getProgress} from './getProgress';
import {updateProgress} from './updateProgress';
import { Auth } from 'aws-amplify';

class Progress extends React.Component {
    // Values used to save page state and progress state 
    curProgress = 0;
    postItFound = 0;
    usbFound = 0;
    foundFilesCount =0;
    //Use a list to keep track of the filenames, indexed with the same list for if values are found
    //  Figure out a way to use a hashtable please
    pertinentFiles = [
        "10000000000000031013.dat", // email to friend selling bear cubs
        "10000002000000031013.dat", //discussion of illegal sale of animals 
        "10000005000000031013.dat", //discussion of illegal sale of wildlife
        "10000006000000031000.dat", //more discussion of illegal sale
        "10000006000000031013.dat", //illegal sale discussion
        "20000005000000031013.dat", //confirmation that sean purchased a bear cub
        "10000009000000031013.dat", //sean purchasing animals w/ ILLEGAL credit cards
        "20000000000000031013.dat", //phishing email 1
        "20000001000000031013.dat", //phishing email 2
        "20000002000000031013.dat", //phishing email 3
        "20000003000000031013.dat", //phishing email 4
        "1000000b000000031013.dat", //phishing email 5 
        "1000000c000000031013.dat", //phishing email 6
        "1000000d000000031013.dat", //phishig email 7 
    ]
    foundFiles =[
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]
    responseMessage = [
        "This is great evidence, directly incriminating Sean",
        "Although not direct proof that Sean bought or sold, this shows intention",
        "Although not direct proof that Sean bought or sold, this shows intention",
        "Although not direct proof that Sean bought or sold, this shows intention",
        "Although not direct proof that Sean bought or sold, this shows intention",
        "This is great evidence, directly incriminating Sean",
        "This is great evidence, directly incriminating Sean in two crimes",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails",
        "Congrats! You found one of the many phishing emails"
    ]

    constructor(props){
        super(props);
        this.state = {user: ''};
        this.getUser = this.getUser.bind(this);
        this.getUserProgress = this.getUserProgress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handeSubmit.bind(this);
        this.initializePage = this.initializePage.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.updateCallback = this.updateCallback.bind(this);
        this.updatePostit = this.updatePostit.bind(this);
        this.addProgress = this.addProgress.bind(this);
        this.initializePage();
    }


    //Accepts the current progress in form of an array
    //  Index 0 : total progress (out of 100)
    //  Index 1 : Has post it
    //  Index 2 : Has sticky note
    setProgress(retProg){
        this.curProgress = retProg[0];
        this.setState({curProgress : retProg[0]});

        this.postItFound = retProg[1];
        this.setState({postItFound : retProg[1]});

        this.usbFound = retProg[2];
        this.setState({usbFound : retProg[2]});
    }
    
    //Called when a new file is found, so increment by 3
    addProgress(){
        this.curProgress = this.curProgress + 3;
        //this.setState(this.curProgress);
    }

    getUser(){
        Auth.currentUserInfo().then(response => {
            
            const json = JSON.stringify(response);
            const user = JSON.stringify(response['username']);
            console.log(response);
            console.log(json);
            console.log(user);
        });
    }

    getUserProgress(){
        //Use the set function as callback for get progress
        getProgress(this.setProgress);
    }

    handleChange(event){
        this.setState({user: event.target.value});
    }

    handeSubmit(event){
        var index = -1;

        if((index=this.pertinentFiles.indexOf(this.state.user))>-1){     
            if(this.foundFiles[index]===false){
                console.log("Found the element at " + index);
                this.foundFiles[index] = true;
                this.setState(this.foundFiles);
                this.foundFilesCount++;
                this.addProgress();
            }else{
                alert("You have already submitted this file!");
            }
        }else{
            alert("Although this file may be helpful, we did not have it in our list. Include in your writeup how this may help your case.")
        }
        event.preventDefault();
    }

    initializePage(){
        getProgress(this.setProgress);
    }

    updateCallback(){
        alert("Callback from update");
    }

    updatePostit(){
        updateProgress(this.updateCallback)
    }

    render() {
        return (
            <div>
                <h1 className="title1" >Progress</h1>
                <h2>Scenario 1</h2>
                <h3>Reconnaissance</h3>
                    <ul class="list">
                    <li class="list-item">{this.postItFound ? <div className = "task-finished">Postit has been found!</div> : <div className = "task-incomplete">HIDDEN</div>}</li>
                    <li class="list-item">{this.usbFound ? <div className = "task-finished">USB was located</div> : <div className = "task-incomplete">HIDDEN</div>}</li>
                    </ul>
                <h3>Investigation</h3>
                <p>
                    Input the name of found files that may be pertinent to the case. Make sure to include all suspected files in your writeup as well. If a file is not found within our list,
                    it does not mean it is not possibly helpful to your case. Include it and justify in your response!
                </p>
                    <form onSubmit={this.handleSubmit}>
                        <label>Filename 
                            <input
                                type="text"
                                value={this.state.user}
                                onChange={this.handleChange}
                            />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                    <h4>Found Files ({this.foundFilesCount}/13)</h4>
                    <ul class="list">
                        {this.foundFiles[0] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[0]}</em> : {this.responseMessage[0]}</div>: <div></div>}
                        {this.foundFiles[1] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[1]}</em> : {this.responseMessage[1]}</div>: <div></div>}
                        {this.foundFiles[2] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[2]}</em> : {this.responseMessage[2]}</div>: <div></div>}
                        {this.foundFiles[3] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[3]}</em> : {this.responseMessage[3]}</div>: <div></div>}
                        {this.foundFiles[4] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[4]}</em> : {this.responseMessage[4]}</div>: <div></div>}
                        {this.foundFiles[5] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[5]}</em> : {this.responseMessage[5]}</div>: <div></div>}
                        {this.foundFiles[6] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[6]}</em> : {this.responseMessage[6]}</div>: <div></div>}
                        {this.foundFiles[7] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[7]}</em> : {this.responseMessage[7]}</div>: <div></div>}
                        {this.foundFiles[8] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[8]}</em> : {this.responseMessage[8]}</div>: <div></div>}
                        {this.foundFiles[9] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[9]}</em> : {this.responseMessage[9]}</div>: <div></div>}
                        {this.foundFiles[10] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[10]}</em> : {this.responseMessage[10]}</div>: <div></div>}
                        {this.foundFiles[11] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[11]}</em> : {this.responseMessage[11]}</div>: <div></div>}
                        {this.foundFiles[12] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[12]}</em> : {this.responseMessage[12]}</div>: <div></div>}
                        {this.foundFiles[13] ? <div className="task-finished"><em className = "found-file"> {this.pertinentFiles[13]}</em> : {this.responseMessage[13]}</div>: <div></div>}
                    </ul>
                <h3>Total Progress</h3>
                <div className="progress">  
                    <ProgressBar id = "scenario1Progress" done={this.curProgress}/>
                </div>
            
            </div>
        );
    }
}

export default Progress;