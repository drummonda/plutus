import React, { Component } from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Main, LoginPage } from './components'

class Routes extends Component {

  render() {
    const { loggedIn } = this.props
    return (
      <div id='routes'>
        loggedIn ?
          <Route path="/" component={Main} />
          :
          <Route path="/" component={LoginPage} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.current
})

export default connect(mapStateToProps, null)(Routes)
