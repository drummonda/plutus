import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { getProvider, fetchUser, postUser } from '../store'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleAuthenticate = this.handleAuthenticate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSignMessage = this.handleSignMessage.bind(this);
  }

  async handleAuthenticate({ publicAddress, signature }) {
    const {data} = await axios.post('/auth/web3', { publicAddress, signature });
    return data;
  }

  async handleClick() {
    const { onLoggedIn } = this.props;

    await this.props.getProvider();
    const { publicAddress, web3 } = this.props;
    this.setState({ loading: true });

    try {
      const userExists = await this.props.fetchUser(publicAddress);
      const addr = await (userExists ? this.props.user : this.props.postUser(publicAddress));
      console.log('addr', addr);

      const signed = await this.handleSignMessage(web3, addr);
      const auth = await this.handleAuthenticate(signed);
      onLoggedIn(auth);

    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  handleSignMessage(web3, user) {
    const { nonce, publicAddress } = user;
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(
        web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

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
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getProvider: () => dispatch(getProvider()),
  fetchUser: publicAddress => dispatch(fetchUser(publicAddress)),
  postUser: publicAddress => dispatch(postUser(publicAddress))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
