import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";
import Active from "./components/active/active.jsx";
import axios from "axios";
import { NavLink } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/body/body.jsx";
import Login from "./components/login/login.jsx";
import Signup from "./components/signup/signup.jsx";
import { NoMatch } from "./components/404/404.jsx";
import { Confirmation } from "./components/active/confirmation.jsx";
class App extends Component {
  state = {
    body: <Body />,
    api: "http://localhost:3001"
  };

  setBody = obj => {
    console.log("clicked");
    this.setState({ body: obj });
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          {/* <Sidebar /> */}
          <Header></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/active" component={Active} />
            <Route path="/confirmation" component={Confirmation} />

            <Route component={NoMatch} />
          </Switch>
        </Router>
      </React.Fragment>
      // <div style={{ backgroundColor: "white" }}>

      //   {this.state.body}
      //   {this.state.active}
      // </div>
    );
  }
}

export default App;
