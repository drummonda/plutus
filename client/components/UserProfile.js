import React, { Component } from 'react'
import Blockies from 'react-blockies'
import jwtDecode from 'jwt-decode'
import { Button, Input, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'
import axios from 'axios'
import { logout } from '../store'

class UserProfile extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      user: null,
      username: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    const { authToken } = this.props
    const { payload: { id } } = await jwtDecode(authToken)
    try {
      // set the headers for authorization
      const { data } = await axios.get(`/api/users/${id}`,{
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      this.setState({
        user: data,
        username: data.username,
      });
    } catch (err) {
      window.alert(err)
    }
  }

  handleChange({ target: { value } }) {
    this.setState({ username: value })
  };

  async handleSubmit({ target }) {
    const { authToken } = this.props
    const { user, username } = this.state
    this.setState({ loading: true })

    try {
      const { data } = await axios.patch(`/api/users/${user.id}`, {username}, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });

      this.setState({
        loading: false,
        user: data,
        username: '',
      });
    } catch (err) {
      console.error(err);
      window.alert(err);
      this.setState({ loading: false })
    }
  };

  render() {
    const { authToken } = this.props
    const { payload: { publicAddress } } = jwtDecode(authToken);
    const { loading, user, username } = this.state;
    const displayUserName = username ? username : '';
    const myUsername = user && user.username;

    return (
      <div className="Profile">
        <p className="blockies">
          Logged in as <Blockies seed={publicAddress} />
        </p>

        <div>
          My username is {myUsername ? <pre>{myUsername}</pre> : 'not set.'} My
          publicAddress is <pre>{publicAddress}</pre>
        </div>

        <div className="change-username">
          <Label htmlFor="username">Change username: </Label>
          <br/>
          <Input
            name="username"
            onChange={this.handleChange}
            value={displayUserName}
          />
          <Button primary disabled={loading} onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>

        <Button className='logout-button' color='red' onClick={this.props.logout}>Don't u dare Logout</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authToken: state.user.authToken
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
