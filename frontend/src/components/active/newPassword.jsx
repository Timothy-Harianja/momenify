import React, { Component } from "react";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./resetPassword.css";
class EmailLogin extends Component {
  state = {
    body: null,
    message: null,
    newPassword: null,
    confirmPassword: null,
  };
  confirm = (json) => {
    let confirmNewP = true;
    if (this.state.newPassword == null || this.state.newPassword.length < 8) {
      confirmNewP = false;
      this.setState({
        message: "New password must be greate than 8 characters!",
      });
    }
    if (this.state.confirmPassword != this.state.newPassword) {
      confirmNewP = false;
      this.setState({
        message: "Passwords do not match!",
      });
    }

    if (confirmNewP) {
      axios
        .post("/api/forgetPasswordRoute/newPassword", json)
        .then((res) => {
          if (res.data.success) {
            this.props.history.push("/login");
            this.setState({
              message: "confirm success!",
            });
          } else {
            this.setState({
              message: "The link is expired!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ message: "Error, confirmation not exists." });
        });
    }
  };
  submitHandler = (e) => {
    e.preventDefault();
  };
  render() {
    return (
      <div id="active-body" className="reset">
        <form onSubmit={this.submitHandler}>
          <h1>Change password</h1>

          <FormGroup controlId="new-password" bsSize="large">
            <FormLabel>New Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) => this.setState({ newPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirm-password" bsSize="large">
            <FormLabel>Confirm new Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) =>
                this.setState({ confirmPassword: e.target.value })
              }
              type="password"
            />
          </FormGroup>
          <Button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={() =>
              this.confirm({
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword,
              })
            }
          >
            submit
          </Button>
          <div id="emailLogin-message" style={{ color: "red" }}>
            {this.state.message}
          </div>
        </form>
      </div>
    );
  }
}

export default EmailLogin;
