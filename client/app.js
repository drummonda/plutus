import React from 'react'

import Routes from './routes'
import { Navbar } from './components'

const App = () => {
  return (
    <div id='main'>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
