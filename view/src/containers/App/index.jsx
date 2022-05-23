import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Error from '../../components/pages/Error'
import App from './App'

const Container = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/error" component={Error} />
      <Redirect to="/error" />
    </Switch>
  </BrowserRouter>
)
export default Container
