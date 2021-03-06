import React from 'react'
import {
  Router,
  Route
} from 'react-router-dom'
import Callback from './routes/Callback'
import Home from './routes/Home'
import Profile from './routes/Profile'
import User from './routes/User'


import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const App = () => (
  <Router history={history}>
    <Route exact path="/" component={Home}/>
    <Route exact path="/callback" component={Callback}/>
    <Route exact path="/profile" component={Profile}/>
    <Route exact path="/user" component={User}/>
  </Router>
)

export default App