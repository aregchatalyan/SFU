import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './App'

const Container = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:roomId" component={App}/>
    </Switch>
  </BrowserRouter>
)
export default Container
