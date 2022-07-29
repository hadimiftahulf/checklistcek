import * as React from 'react'
import {Switch, Route} from 'react-router-dom'
import './App.css'
import Login from './pages/Login/login'
import {useCookies} from 'react-cookie'
import Main from './pages/Main/Main'

function App() {
  return (
    <div style={{backgroundColor: '#eff2f4', padding: '100px 405px'}}>
      {/* <h1>Welcome to React Router!</h1> */}
      <Switch>
        <Route path="/main" render={(props) => <Main {...props} />} />
        <Route path="/" render={(props) => <Login {...props} />} />
      </Switch>
    </div>
  )
}

export default App
