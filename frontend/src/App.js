import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/header/header.jsx";

class App extends Component {
  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <Header></Header>
      </div>
    );
  }
}

export default App;
