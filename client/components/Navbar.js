import React, { Component } from 'react'
import Pluto from './icons/Pluto'
import { Menu, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Navbar extends Component {
  state = {}

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });

  }

  render() {
    const { activeItem } = this.state
    const { loggedIn } = this.props

    return (
      <Menu inverted size='large' className='navbar'>
        <Menu.Item id='logo'>
          <Pluto />
          Plutus
        </Menu.Item>

        <Menu.Menu position='right'>

        {loggedIn ?

          <React.Fragment>
            <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
              <Link to="/home">Home</Link>
            </Menu.Item>

            <Menu.Item
              name='profile'
              active={activeItem === 'profile'}
              onClick={this.handleItemClick}
            >
              <Link to="/profile">Profile</Link>
            </Menu.Item>

            <Menu.Item
              name='loanPools'
              active={activeItem === 'loanPools'}
              onClick={this.handleItemClick}
            >
              <Link to="/loans">Loan Pools</Link>
            </Menu.Item>
          </React.Fragment>

        :

          <React.Fragment>
            <Menu.Item
              name='metamask'
              active={activeItem === 'metamask'}
              onClick={this.handleItemClick}
            >
              <Link to="/metamask">MetaMask Setup</Link>
            </Menu.Item>

            <Menu.Item
              name='Login'
              active={activeItem === 'login'}
              onClick={this.handleItemClick}
            >
              <Link to="/login">Login</Link>
            </Menu.Item>
          </React.Fragment> }
           <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn
})

export default connect(mapStateToProps)(Navbar)
