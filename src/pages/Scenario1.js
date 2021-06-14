// pages/Scenario1.js

import React from "react";
import { API, Auth } from 'aws-amplify';
import Unity, { UnityContext } from "react-unity-webgl";

// This webpage is structured as a class while most are const
// This is due to this webpage having different states

class Scenario1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {getUSB: false,
      getPostItNote: false,
      usbSet: false,
      postItSet: false,
      ip: "NA",
      username: "Administrator",
      password: "NA",
      ipVal: "Insert IP From Alert Here!"
  };

  // Unity instance
  this.unityContext = new UnityContext({
    loaderUrl: "build/Build_5-30-2021.loader.js",
    dataUrl: "build/Build_5-30-2021.data",
    frameworkUrl: "build/Build_5-30-2021.framework.js",
    codeUrl: "build/Build_5-30-2021.wasm",
  });
  
  this.unityContext.on("canvas", (canvas) => {
    canvas.width = 960;
    canvas.height = 540;
  });
  

  // Event Listener
  this.unityContext.on("getUSB", () => {
    this.setState({ getUSB: true});
  });
  
  // Event Listener
  this.unityContext.on("getPostItNote", () => {
    this.setState({ getPostItNote: true});
  });
}
  
  render() {

    async function launchEC2() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken

      const requestInfo = {
        headers: { Authorization: token }
      }
        const data = await API.get('forensicsrangeapi', '/launchInst', requestInfo)
        console.log({ data })
        alert("Instance is launching! Please wait 4 minutes before requesting instance info")
    }

    async function requestInst() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken

      const requestInfo = {
        headers: { Authorization: token }
      }
        const data = await API.get('forensicsrangeapi', '/requestInst', requestInfo)
        console.log( data )
        alert("PLEASE DOCUMENT Instance IP: " + data.ip)
        alert("Change RDP Setings for Username: Administrator")
        alert("Instance Password: " + data.password)
    };

    async function stopInstance() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken

      const requestInfo = {
        headers: { Authorization: token }
      }
        const data = await API.get('forensicsrangeapi', '/stopInst', requestInfo)
        console.log({ data })
        alert("Terminating Instance!")
    }
    async function foundPostIt() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken

      const requestInfo = {
        headers: { Authorization: token }
      }
        const data = await API.get('forensicsrangeapi', '/setPostIt', requestInfo)
        console.log({ data })
    }
    async function foundUSB() {
      const user = await Auth.currentAuthenticatedUser()
      const token = user.signInUserSession.idToken.jwtToken

      const requestInfo = {
        headers: { Authorization: token }
      }
        const data = await API.get('forensicsrangeapi', '/setUSB', requestInfo)
        console.log({ data })
    }

    if (this.state.getUSB && !(this.state.usbSet)) {
      this.setState({ usbSet: true})
      foundUSB()
    }
    if (this.state.getPostItNote && !(this.state.postItSet)) {
      this.setState({ postItSet: true})
      foundPostIt()
    }

    // progress bar logic
    var i = 0;
    function move() {
      if (i === 0) {
        i = 1;
        var elem = document.getElementById("myProgressBar");
        var width = 1;
        // 120 seconds = 2 minutes which is how long it takes to boot an instance
        var seconds = 120;
        var factor = 10;
        var id = setInterval(frame, seconds*factor); 
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;

            elem.innerHTML = "Instance Ready!";
            
            // enable two other buttons
            var detail = document.getElementsByClassName('detailBtn')[0];
            detail.style.display = "inline-block";
            var stop = document.getElementsByClassName('stopBtn')[0];
            stop.style.display = "inline-block";

            // disable start button
            var start = document.getElementsByClassName('startBtn')[0];
            start.style.display = "none";
            
          } else {
            width++;
            elem.style.width = width + "%";
            elem.innerHTML = width + "%";
          }
        }
      }
    }

    // makes progress bar visible and calls progress bar function to move it
    function showProgress() {
      launchEC2();
      document.getElementById('myProgress').style.display = "inline-block";
      document.getElementById('myProgressBar').style.display = "block";
      move();
    }

    function reset() {
      stopInstance();
      // disable two other buttons
      var detail = document.getElementsByClassName('detailBtn')[0];
      detail.style.display = "none";
      var stop = document.getElementsByClassName('stopBtn')[0];
      stop.style.display = "none";

      // enable start button
      var start = document.getElementsByClassName('startBtn')[0];
      start.style.display = "inline-block";

      document.getElementById('myProgress').style.display = "none";
      document.getElementById('myProgressBar').style.display = "none";
    }


    return (
      <div>
    <h1 className="title1">Scenario 1</h1>
    <div className ="pageContent">
        <h2 className= "title2">Case Description:</h2>
        <p className= "paragraph"> As the head of the Forensics Unit at SeniorProject PD, you have been <br></br>
                                   granted a search warrant to investigate claims that illegal activities are <br></br>
                                   occuring at a Mr. Sean Jones's residence. With your investigative <br></br>
                                   knowledge findout if he is up to anything and if so make sure to get all <br></br>
                                   the evidence there is to bring this criminal to justice.
        </p>
    </div> 
    <Unity
      unityContext={this.unityContext}
      matchWebGLToCanvasSize={true}
      style={{ width: "960px", height: "540px" }}
    />
    <div>
    <button className="startBtn"  onClick= {showProgress}>Start Instance </button>
    <button className="detailBtn" style={{display: "none"}} onClick={requestInst}>Get Instance Details </button>
    <button className="stopBtn" style={{display: "none"}} onClick={reset}>Stop Instance </button>
      
    </div>
    
    
    <div id="myProgress" style={{display: "none"}}>
      <div id="myProgressBar" style={{display: "none"}}>0%</div>
    </div> 
  </div>
    );
  }
}

export default Scenario1;