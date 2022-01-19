import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./App";

const Container = () => (
  <BrowserRouter>
    <Route path="/:userId" exact component={App} />
  </BrowserRouter>
);
export default Container;
