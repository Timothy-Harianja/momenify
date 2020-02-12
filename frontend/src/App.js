import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";
import Body from "./components/body/body.jsx";

class App extends Component {
  state = { body: <Body /> };

  setBody = obj => {
    this.setState({ body: obj });
  };

  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <Header setBody={this.setBody}></Header>
        {this.state.body}
      </div>
    );
  }
}

export default App;
