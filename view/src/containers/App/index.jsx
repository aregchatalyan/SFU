import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Error from '../../components/pages/Error'
import App from './App'

const Container = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/:roomId" component={App}/>
      {/*<Route path="/" exact component={Error}/>*/}
    </Switch>
  </BrowserRouter>
)
export default Container
