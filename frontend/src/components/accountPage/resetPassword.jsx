import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./accountpage.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

class resetPassword extends Component {
  state = {
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
    message: null
  };

  submitHandler = e => {
    e.preventDefault();
  };

  tryReset = obj => {
    var confirmNewP = this.state.newPassword == this.state.confirmPassword;
    if (confirmNewP) {
      axios
        .post("/api/resetPasswordRoute/resetPassword", obj)
        .then(res => {
          if (res.data.success == true) {
            // this.props.history.push("/");
            window.location = "/";
          } else {
            this.setState({
              message: "Password incorrect"
            });
          }
        })
        .catch(err => {
          console.log("error of catch:", err);
        });
    } else {
      this.setState({ message: "new password doesn't match" });
    }
  };

  submitHandler = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="reset-password">
        <form onSubmit={this.submitHandler}>
          <h1>Change password</h1>

          <FormGroup controlId="old-password" bsSize="large">
            <FormLabel>old password </FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ oldPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="new-password" bsSize="large">
            <FormLabel>New Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ newPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirm-password" bsSize="large">
            <FormLabel>Confirm new Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ confirmPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <Button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={() =>
              this.tryReset({
                oldPassword: this.state.oldPassword,
                password: this.state.newPassword
              })
            }
          >
            submit
          </Button>
          <div id="reset-password-message">{this.state.message}</div>
        </form>
      </div>
    );
  }
}

export default resetPassword;
