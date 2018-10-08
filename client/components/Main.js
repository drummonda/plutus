import React, { Component } from 'react'
import UserProfile from './UserProfile'
import { connect } from 'react-redux'
import { login, logout, fetchAuthToken, handleAuthenticate } from '../store'
import todolist from '../web3/contract'

class Main extends Component {

  async componentDidMount() {
    const { provider } = this.props
    const accounts = await provider.eth.getAccounts();
    await todolist.methods.createTodo("add frontend").send({
      from: accounts[0]
    });
    const { task, completed } = await todolist.methods.returnTodo(0).call();
    console.log("task", task);
    console.log("completed", completed);
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
