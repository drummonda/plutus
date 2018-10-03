import React, { Component } from 'react'
import Login from './Login'
import UserProfile from './UserProfile'
import { connect } from 'react-redux'
import { logout } from '../store'

const LS_KEY = 'mm-login:auth';

class Main extends Component {

  constructor(props) {
    super(props);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleLoggedOut = this.handleLoggedOut.bind(this);
  }

  componentWillMount() {
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({ auth });
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

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
