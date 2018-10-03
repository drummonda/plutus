import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

export default class Navbar extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted className='navbar'>
        <Menu.Item>
          <img src='pluto.png' />
          Plutus
        </Menu.Item>

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
      </Menu>
    )
  }
}
