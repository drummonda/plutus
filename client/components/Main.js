import React, { Component } from 'react'
import UserProfile from './UserProfile'
import { connect } from 'react-redux'
import { login, logout, fetchAuthToken } from '../store'
import getContractArtifact from '../web3/contract'

class Main extends Component {

  async componentDidMount() {
    const multiply8 = await getContractArtifact("Multiply8")
    const fortyEight = await multiply8.methods.multiply(6).call()
    console.log("Should be forty eight", fortyEight)
  }

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
  user: state.user.current,
  provider: state.web3.provider
})

const mapDispatchToProps = dispatch => ({
  login: token => dispatch(login(token)),
  logout: () => dispatch(logout()),
  fetchAuthToken: () => dispatch(fetchAuthToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
