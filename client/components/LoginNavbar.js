import React, { Component } from 'react'
import Pluto from './icons/Pluto'
import { Menu, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Navbar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    const { loggedIn } = this.props;

    return (
      <Menu inverted size='large' className='navbar'>
        <Menu.Item id='logo'>
          <Pluto />
          Plutus
        </Menu.Item>

        <Menu.Menu>
          <Menu.Item
            name='metamask'
            active={activeItem === 'metamask'}
            onClick={this.handleItemClick}
          >
            MetaMask Setup
          </Menu.Item>

          <Menu.Item
            name='Login'
            active={activeItem === 'login'}
            onClick={this.handleItemClick}
          >
            Login
          </Menu.Item>

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
