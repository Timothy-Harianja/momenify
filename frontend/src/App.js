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
import AboutUs from "./components/about-us/about-us.jsx";
import TermOfUse from "./components/term-of-use/term-of-use.jsx";
import Message from "./components/Messenger/index.js";
import AccountPage from "./components/accountPage/accountpage.jsx";
class App extends Component {
  state = {
    body: <Body />,
    api: "http://localhost:5000"
  };

  setBody = obj => {
    console.log("clicked");
    this.setState({ body: obj });
  };

  state = {
    userId: null
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
            <Route path="/signup" component={Signup} />
            <Route path="/active" component={Active} />
            <Route path="/confirmation" component={Confirmation} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/term-of-use" component={TermOfUse} />
            <Route path="/message" component={Message} />
            <Route
              path="/accountpage"
              component={this.state.userId != undefined ? AccountPage : Login}
            />
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
