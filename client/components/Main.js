import React, { Component } from 'react';

import Login from './Login';
import UserProfile from './UserProfile';

const LS_KEY = 'mm-login:auth';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLoggedOut = this.handleLoggedOut.bind(this);
    this.handleSetUser = this.handleSetUser.bind(this);
  }

  componentWillMount() {
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    const userType = localStorage.getItem('user');
    this.setState({ auth });
  }

  handleLoggedIn(auth) {
    console.log("This is the handle logged in auth", auth);
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth });
    console.log("This is the new state", this.state);
  }

  handleLoggedOut() {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  }

  render() {
    const { auth } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Plutus</h1>
        </header>
        <div className="App-intro">
          {auth ?
            (<UserProfile auth={auth} onLoggedOut={this.handleLoggedOut}/>)
            : (
            <div>
              <p className="login-prompt">
              Let's get this party started!
              <br/>
              Install MetaMask if you haven't already, and you can use it to create and account and/or login
              </p>
              <Login onLoggedIn={this.handleLoggedIn} />
            </div>

          )}
        </div>
      </div>
    );
  }
}

export default Main;
