import React, { Component } from 'react'
import Pluto from './Pluto'
import { Menu, Input } from 'semantic-ui-react'

export default class Navbar extends Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted size='large' className='navbar'>
        <Menu.Item id='logo'>
          <Pluto />
          Plutus
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            Home
          </Menu.Item>

          <Menu.Item
            name='profile'
            active={activeItem === 'profile'}
            onClick={this.handleItemClick}
          >
            Profile
          </Menu.Item>

          <Menu.Item
            name='loanPools'
            active={activeItem === 'loanPools'}
            onClick={this.handleItemClick}
          >
            Loan Pools
          </Menu.Item>

           <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
