import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";

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

  emailLogin = obj => {
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
      this.setState({ message: "email cannot be empty" });
    }

    if (checkEmail) {
      axios
        .post("/api/forgetPasswordRoute/forgetPassword", obj)
        .then(res => {
          if (res.data.success == true) {
            // go to a page say you sent email
            this.props.history.push("/confirmation");
          } else {
            this.setState({
              message: "email not registered"
            });
          }
        })
        .catch(err => {
          console.log("error of catch:", err);
        });
    } else {
      this.setState({ message: "your email incorrect" });
    }
  };

  submitHandler = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="reset-password">
        <form onSubmit={this.submitHandler}>
          <h1>login with email confirmation</h1>

          <FormGroup controlId="email" bsSize="large">
            <FormLabel>email </FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ email: e.target.value })}
              type="email"
            />
          </FormGroup>

          <Button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={() =>
              this.emailLogin({
                email: this.state.email,
                token: makeToken(30),
                tokenExpire: new Date().getTime() + 15 * 60 * 1000
              })
            }
          >
            send
          </Button>
          <div id="forget-password-message">{this.state.message}</div>
        </form>
      </div>
    );
  }
}

export default forgetPassword;
