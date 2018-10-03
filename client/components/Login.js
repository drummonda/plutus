import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getProvider, fetchUser, postUser, handleAuthenticate, login } from '../store'
import { handleSignMessage } from '../utils'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin() {
    try {
      // First, grab the web3 provider
      this.setState({ loading: true });
      const { publicAddress, web3 } = this.props;

      // Does the user exist? If not, create one
      const userExists = await this.props.fetchUser(publicAddress);
      const addr = await (userExists ? this.props.user : this.props.postUser(publicAddress));

      // Grab the user's signed message from metamask
      const signed = await handleSignMessage(web3, addr);
      console.log('signed', signed);

      // Generate a jwt authentication token
      const authToken = await this.props.handleAuthenticate(signed);

      // Store the token and complete login
      this.props.login(authToken);

    } catch (err) {
      window.alert(err.message);
      console.error(err);
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="login">
          <Button primary className="Login-button Login-mm" onClick={this.handleLogin}>
            {loading ? 'Loading...' : 'Login as a User with MetaMask'}
          </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  publicAddress: state.web3.publicAddress,
  web3: state.web3.provider,
  user: state.user.current,
  authToken: state.user.authToken
})

const mapDispatchToProps = dispatch => ({
  getProvider: () => dispatch(getProvider()),
  fetchUser: publicAddress => dispatch(fetchUser(publicAddress)),
  postUser: publicAddress => dispatch(postUser(publicAddress)),
  handleAuthenticate: signed => dispatch(handleAuthenticate(signed)),
  login: auth => dispatch(login(auth))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
