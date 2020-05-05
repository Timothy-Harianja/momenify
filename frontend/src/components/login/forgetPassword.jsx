import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./forgetPassword.css";

import axios from "axios";
import { Redirect } from "react-router-dom";

function makeToken(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class forgetPassword extends Component {
  state = {
    email: null,
    message: null
  };

  submitHandler = e => {
    e.preventDefault();
  };

  newPasswordRequest = obj => {
    var checkEmail = true;
    if (this.state.email) {
      //not null
      if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        checkEmail = false;
        console.log("email incorrect");
      }
    } else {
      //null
      checkEmail = false;
      this.setState({ message: "Email cannot be empty" });
    }

    if (checkEmail) {
      axios
        .post("/api/forgetPasswordRoute/forgetPassword", obj)
        .then(res => {
          if (res.data.success == true) {
            // go to a page say you sent email
            this.props.history.push("/resetconfirmation");
          } else {
            this.setState({
              message: "Email not registered"
            });
          }
        })
        .catch(err => {
          console.log("error of catch:", err);
        });
    } else {
      this.setState({ message: "Your email incorrect" });
    }
  };

  submitHandler = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="reset-password">
        <form onSubmit={this.submitHandler}>
          <h1> Forget Password</h1>

          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email Address</FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ email: e.target.value })}
              type="email"
              id="forgotpasswordemail"
            />
          </FormGroup>

          <Button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={() =>
              this.newPasswordRequest({
                email: this.state.email,
                token: makeToken(30),
                tokenExpire: new Date().getTime() + 15 * 60 * 1000
              })
            }
          >
            Send
          </Button>
          <div id="forget-password-message">{this.state.message}</div>
        </form>
      </div>
    );
  }
}

export default forgetPassword;
