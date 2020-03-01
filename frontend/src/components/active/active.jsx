import React, { Component } from "react";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./active.css";
class Active extends Component {
  state = {
    body: null
  };
  confirm = () => {
    axios
      .post("/api/activeRoute/active")
      .then(data => {
        console.log("this is true or false: " + data.data.message);
        this.setState({
          body: <div id="buttom-text">{data.data.message}</div>
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <div id="active-body">
        <div id="top-text">
          By clicking the button, you agree the policy of using our webpage
        </div>
        <Button id="active-button" type="submit" onClick={() => this.confirm()}>
          Activate
        </Button>
        {this.state.body}
      </div>
    );
  }
}

export default Active;
