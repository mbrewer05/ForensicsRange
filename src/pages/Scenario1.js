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
        alert("DOCUMENT Instance IP: " + data.ip)
        alert("DOCUMENT Username: Administrator")
        alert("DOCUMENT Password: " + data.password)
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
        <button onClick={launchEC2}> Launch Instance </button>
        <p></p>
        <button onClick={requestInst}> Get Instance Details </button>
        <p></p>
        <button onClick={stopInstance}> Stop Instance </button>
        <p></p>
    </div> 

    
    
    
    <Unity
      unityContext={this.unityContext}
      matchWebGLToCanvasSize={true}
      style={{ width: "960px", height: "540px" }}
    />
  </div>
    );
  }
}

export default Scenario1;