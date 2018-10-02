import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import {Button, Input, Label} from 'semantic-ui-react';
import axios from 'axios';

class UserProfile extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      user: null,
      username: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const { auth: { accessToken } } = this.props;
    const { payload: { id } } = await jwtDecode(accessToken);
    try {
      // set the headers for authorization
      const { data } = await axios.get(`/api/users/${id}`,{
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      this.setState({
        user: data,
        username: data.username,
      });
    } catch (err) {
      window.alert(err);
    }
  }

  handleChange({ target: { value } }) {
    this.setState({ username: value });
  };

  async handleSubmit({ target }) {
    const { auth: { accessToken } } = this.props;
    const { user, username } = this.state;
    this.setState({ loading: true });
    // Set the headers for authorization
    try {
      const { data } = await axios.patch(`/api/users/${user.id}`, {username}, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
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
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
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

        <Button className='logout-button' color='red' onClick={onLoggedOut}>Don't u dare Logout</Button>
      </div>
    );
  }
}

export default UserProfile;
