import React, { Component } from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import { Main } from './components'

export default class Routes extends Component {

  render() {
    return (
      <Route path="/" component={Main} />
    )
  }
}
