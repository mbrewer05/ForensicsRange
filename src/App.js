import logo from './logo.svg';
import './App.css';
// import {API, Auth} from 'aws-amplify'
import Amplify, {API, Auth} from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'

function App() {
  async function callApi() {
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
    console.log({ token })

    const requestInfo = {
      headers: {
        Authorization: token
      }
    }

    const data = await API.get('forensicsrangeapi', '/forensicsrangeapi', requestInfo)
    console.log({ data })
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={callApi}> Call Api </button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
