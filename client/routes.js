import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Main, LoginPage } from './components'
import { fetchAuthToken, fetchUser, getProvider, login } from './store'
const LS_KEY = 'mm-login:auth';

class Routes extends Component {

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.fetchAuthToken()
    }
  }

  async componentDidMount() {
    await this.props.getProvider()
    await this.checkForToken()
  }

  async checkForToken() {
    const authToken = JSON.parse(localStorage.getItem(LS_KEY));
    const { publicAddress } = this.props
    if(authToken) {
      const userReceived = await this.props.fetchUser(publicAddress)
      console.log('user received', userReceived)
      const user = userReceived ? this.props.user : null
      console.log('user', user)
      if(user) this.props.login(authToken)
    }
  }

  render() {
    const { loggedIn } = this.props
    return (
      <div id='routes'>
        <Switch>
        {loggedIn ?
          <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/home" component={Main}/>
          </Switch>
          :
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/login" component={LoginPage} />
          </Switch>}
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.current,
  authToken: state.user.authToken,
  publicAddress: state.web3.publicAddress,
  loggedIn: state.user.loggedIn
})

const mapDispatchToProps = dispatch => ({
  login: token => dispatch(login(token)),
  fetchAuthToken: () => dispatch(fetchAuthToken()),
  getProvider: () => dispatch(getProvider()),
  fetchUser: publicAddress => dispatch(fetchUser(publicAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)
