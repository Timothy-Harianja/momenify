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
        console.log("data: ", data.data.success);
        if (data.data.success) {
          this.props.history.push("/login");
        } else {
          this.setState({
            message: "This email has already activated!"
          });
        }
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
        <p></p>
        <div style={{ color: "red", textAlign: "center" }}>
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default Active;
