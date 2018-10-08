import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Main, LoginPage } from './components'
import { fetchAuthToken, fetchUser, setProvider, setPublicAddress, login } from './store'
import web3 from './web3/provider'

const LS_KEY = 'mm-login:auth';

class Routes extends Component {

  componentDidUpdate(prevProps) {
    if(prevProps.loggedIn !== this.props.loggedIn) {
      this.props.fetchAuthToken()
    }
  }

  async componentDidMount() {
    const coinbase = await this.getCoinbase();
    this.props.setProvider(web3)
    this.props.setPublicAddress(coinbase)
    await this.checkForToken()
  }

  async getCoinbase() {
    const coinbase = await web3.eth.getCoinbase((err, coinbase) => {
      return coinbase || err
    })
    if (!coinbase) {
      window.alert('Please activate MetaMask first.')
      return
    }
    return coinbase
  }

  async checkForToken() {
    const authToken = JSON.parse(localStorage.getItem(LS_KEY));
    const { publicAddress } = this.props
    if(authToken) {
      const userReceived = await this.props.fetchUser(publicAddress)
      const user = userReceived ? this.props.user : null
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
  setProvider: provider => dispatch(setProvider(provider)),
  setPublicAddress: addr => dispatch(setPublicAddress(addr)),
  fetchUser: addr => dispatch(fetchUser(addr))
})

export default connect(mapStateToProps, mapDispatchToProps)(Routes)
