import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";
import Active from "./components/active/active.jsx";
import emailLogin from "./components/active/emailLogin.jsx";
import axios from "axios";
import { NavLink } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/body/body.jsx";
import Login from "./components/login/login.jsx";
import forgetPassword from "./components/login/forgetPassword.jsx";
import Signup from "./components/signup/signup.jsx";
import { NoMatch } from "./components/404/404.jsx";
import { Confirmation } from "./components/active/confirmation.jsx";
import AboutUs from "./components/about-us/about-us.jsx";
import TermOfUse from "./components/term-of-use/term-of-use.jsx";
import Message from "./components/Messenger/index.js";
import AccountPage from "./components/accountPage/accountpage.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
class App extends Component {
  state = {
    userId: null
  };

  setConfirmationContent = content => {
    this.setState({ ConfirmationContent: content });
  };

  setBody = obj => {
    console.log("clicked");
    this.setState({ body: obj });
  };

  componentDidMount() {
    axios.get("/api/loginRoute/session").then(res => {
      console.log(res.data);
      this.setState({ userId: res.data.userId });
    });
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          {/* <Sidebar /> */}
          <Header></Header>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/forgetPassword" component={forgetPassword} />

            <Route
              path="/signup"
              component={Signup}
              // render={props => (
              //   <Signup
              //     {...props}
              //     setConfirmationContent={e => {
              //       this.setConfirmationContent(e);
              //     }}
              //   />
              // )}
            />
            <Route path="/active" component={Active} />
            <Route path="/emailLogin" component={emailLogin} />
            <Route
              path="/confirmation"
              component={Confirmation}
              // render={props => (
              //   <Confirmation {...props} ConfirmationContent={"hot"} />
              // )}
            />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/term-of-use" component={TermOfUse} />
            <Route
              path="/message"
              component={this.state.userId != undefined ? Message : Login}
            />
            <Route
              path="/accountpage"
              component={this.state.userId != undefined ? AccountPage : Login}
            />

            <Route component={NoMatch} />
          </Switch>
        </Router>
        {this.state.body}
      </React.Fragment>
      // <div style={{ backgroundColor: "white" }}>

      //   {this.state.active}
      // </div>
    );
  }
}

export default App;
