import {React, useState, useEffect} from 'react';
import './App.css';
import { API, Auth, Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//Web Pages
import Home from './pages/Home.js';
import About from './pages/About.js';
import ForensicsPractice from './pages/ForensicsPractice.js';
import AutopsyInstances from './pages/AutopsyInstances.js';
import ForensicsImageStore from './pages/ForensicsImageStore.js';
import Scenario1 from './pages/Scenario1.js';
import Scenario2 from './pages/Scenario2.js';
import Scenario3 from './pages/Scenario3.js';
import GettingStarted from './pages/GettingStarted.js';
import Progress from './pages/Progress.js';

//warning-sign
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(awsconfig);

function App() {
    const [authenicated, setAuthenicated] = useState(false);
    const [show, setShow] = useState(true);

    useEffect(() => {
        Auth.currentAuthenticatedUser().then(function(user){
            const token = user.signInUserSession.idToken.jwtToken
    
            const requestInfo = {
            headers: { Authorization: token }
            }
            API.get('forensicsrangeapi', '/checkCurrentUser', requestInfo).then(function(data){
                console.log( data )
                if (data.authorization_status === "true"){
                    setAuthenicated(true);
                }
            });
        });
    }, []);

    return (
    <BrowserRouter>
        <div className="App">
            <header className="App-header">
                <h1>Senior Project Website</h1>
            </header>
            {!authenicated&show ? <Alert variant='danger' style={{ margin:'0px' }}>
                    <Alert.Heading>Warning!!!</Alert.Heading>
                <p>
                You are not authorized for full funtionality. Please check in with an admininstrator. 
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                <Button onClick={() => setShow(false)} variant="outline-danger">
                    Close
                </Button>
                </div>
            </Alert> : null}
        <div class="navbar">
            <a href="/">Home</a>

            <div class="dropdown" >  {/* dropdown menu for forensics Practice */}
                <button class="dropbtn"> Forensics Practice 
                     <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="/scenario1">Scenario 1</a>
                    <a href="/scenario2">Scenario 2</a>
                    <a href="/scenario3">Scenario 3</a>
                </div>
            </div>
            <a href="/progress">Progress</a>
            <a href="/gettingStarted">Getting Started</a>
            <a href="/autopsyInstances">Autopsy Instances</a>
            <a href="/forensicsImageStore">Forensic Image Store</a>
            <a href="/about">About</a>
        </div>

        {/* components below, HTML above */}
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>

            <Route path="/gettingStarted">
                <GettingStarted />
            </Route>

            <Route path="/forensicsPractice">  {/* Doesn't actually link to it cause of button above */}
                <ForensicsPractice />
            </Route>

            <Route path="/scenario1">
                <Scenario1 />
            </Route>

            <Route path="/scenario2">
                <Scenario2 />
            </Route>

            <Route path="/scenario3">
                <Scenario3 />
            </Route>

            <Route path='/progress'>
                <Progress />
            </Route>

            <Route path="/autopsyInstances">
                <AutopsyInstances />
            </Route>


            <Route path="/forensicsImageStore">
                <ForensicsImageStore />
            </Route>

            <Route path="/about">
                <About />
            </Route>
        </Switch>

        <AmplifySignOut />
        </div>
    </BrowserRouter>

    );
}

export default withAuthenticator(App);
/* Replace 'App' above with what is in comments to have Authentication working again */
