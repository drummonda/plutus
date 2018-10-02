import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getProvider, fetchUser, postUser, handleAuthenticate } from '../store'
import { handleSignMessage } from '../utils'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const { onLoggedIn } = this.props;
    this.initializeWeb3();

    try {
      // Does the user exist? If not, create one
      const userExists = await this.props.fetchUser(publicAddress);
      const addr = await (userExists ? this.props.user : this.props.postUser(publicAddress));

      // Grab the user's signed message from metamask
      const signed = await handleSignMessage(web3, addr);

      // Generate a jwt authentication token
      await this.props.handleAuthenticate(signed);
      const { authToken } = this.props;

      // Store the token and complete login
      onLoggedIn(authToken);

    } catch (err) {
      window.alert(err.message);
      console.error(err);
      this.setState({ loading: false });
    }
  }

  async initializeWeb3() {
    await this.props.getProvider();
    const { publicAddress, web3 } = this.props;
    this.setState({ loading: true });
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="login">
          <Button primary className="Login-button Login-mm" onClick={this.handleClick}>
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
  handleAuthenticate: signed => dispatch(handleAuthenticate(signed))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
