import React, { Component } from 'react'
import Login from './Login'

export default class LoginPage extends Component {

  render() {
    return (
        <div>
          <p className="login-prompt">
          Let's get this party started!
          <br/>
          Install MetaMask if you haven't already, and you can use it to create and account and/or login
          </p>
          <Login />
        </div>
    );
  }
}
