import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";
import Active from "./components/active/active.jsx";
import axios from "axios";
import { NavLink } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavigationBar from "./components/header/header.jsx";
import Home from "./components/body/body.jsx";
import Login from "./components/login/login.jsx";
import Signup from "./components/signup/signup.jsx";
import { NoMatch } from "./components/404/404.jsx";

class App extends Component {
  state = {
    body: <Body />,
    active: <Active />,
    api: "http://localhost:3001/api"
  };

  setBody = obj => {
    console.log("clicked");
    this.setState({ body: obj });
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />

          {/* <Sidebar /> */}

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />

            <Route component={NoMatch} />
          </Switch>
        </Router>
      </React.Fragment>
      // <div style={{ backgroundColor: "white" }}>
      //   <Header
      //     setBody={this.setBody}
      //     setContent={this.setContent}
      //     api={this.state.api}
      //   ></Header>
      //   {this.state.body}
      //   {this.state.active}
      // </div>
    );
  }
}

export default App;
