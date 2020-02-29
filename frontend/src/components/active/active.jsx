import React, { Component } from "react";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

class Active extends Component {
  confirm = () => {
    axios
      .post("api/active")
      .then(data => data.json())
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <Button type="submit" onClick={() => this.confirm()}>
        Activate
      </Button>
    );
  }
}

export default Active;
