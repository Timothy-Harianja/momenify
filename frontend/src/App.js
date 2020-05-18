import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import ProfilePage from "./components/profile-page/profile-page";
import HastagPage from "./components/hashtag-page/hashtag-page";
import Active from "./components/active/active.jsx";
import newPassword from "./components/active/newPassword.jsx";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/body/body.jsx";
import Login from "./components/login/login.jsx";
import forgetPassword from "./components/login/forgetPassword.jsx";
import Signup from "./components/signup/signup.jsx";
import { NoMatch } from "./components/404/404.jsx";
import { Confirmation } from "./components/active/confirmation.jsx";
import { ResetConfirmation } from "./components/active/resetConfirmation.jsx";
import AboutUs from "./components/about-us/about-us.jsx";
import TermOfUse from "./components/term-of-use/term-of-use.jsx";
import Message from "./components/Messenger/index.js";
import Career from "./components/career/career.jsx";
import ContactUs from "./components/contact-us/contact-us.jsx";
import AccountPage from "./components/accountPage/accountpage.jsx";
import ContactUS from "./components/contact-us/contact-us.jsx";
import { Thanks } from "./components/others/thanks.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {
    userId: null,
  };

  componentDidMount() {}

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
            <Route path="/profile" component={ProfilePage} />
            <Route path="/hashtag" component={HastagPage} />
            <Route path="/contact-us" component={ContactUS} />

            <Route path="/signup" component={Signup} />
            <Route path="/confirmation" component={Confirmation} />
            <Route path="/thanks" component={Thanks} />
            <Route path="/active" component={Active} />

            <Route path="/newpassword" component={newPassword} />
            {/* <Route path="/confirmation" component={Confirmation} /> */}
            <Route path="/resetconfirmation" component={ResetConfirmation} />

            <Route path="/about-us" component={AboutUs} />
            <Route path="/contact-us" component={ContactUs} />
            <Route path="/policy" component={TermOfUse} />
            <Route path="/careers" component={Career} />
            <Route
              path="/message"
              component={Message}
              // component={this.state.userId != undefined ? Message : Login}
            />
            <Route
              path="/accountpage"
              component={AccountPage}
              // component={this.state.userId != undefined ? AccountPage : Login}
            />
            <Route component={NoMatch} />
          </Switch>
        </Router>
        {this.state.body}
      </React.Fragment>
    );
  }
}

export default App;
