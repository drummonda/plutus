import React, { Component } from 'react'
import UserProfile from './UserProfile'
import { connect } from 'react-redux'
import { login, logout, fetchAuthToken, handleAuthenticate } from '../store'

class Main extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Plutus</h1>
        </header>
        <UserProfile />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.user.authToken,
  publicAddress: state.web3.publicAddress,
  user: state.user.current
})

const mapDispatchToProps = dispatch => ({
  login: token => dispatch(login(token)),
  logout: () => dispatch(logout()),
  fetchAuthToken: () => dispatch(fetchAuthToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
