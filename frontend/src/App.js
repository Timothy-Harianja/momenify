import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";
import Active from "./components/active/active.jsx";
import axios from "axios";
import { NavLink } from "react-bootstrap";
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
      <div style={{ backgroundColor: "white" }}>
        <Header
          setBody={this.setBody}
          setContent={this.setContent}
          api={this.state.api}
        ></Header>
        {this.state.body}
        {this.state.active}
      </div>
    );
  }
}

export default App;
