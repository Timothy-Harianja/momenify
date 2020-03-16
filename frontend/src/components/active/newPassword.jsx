import React, { Component } from "react";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./resetPassword.css";
class EmailLogin extends Component {
  state = {
    body: null,
    message: null,
    newPassword: null,
    confirmPassword: null
  };
  confirm = json => {
    var confirmNewP = this.state.newPassword == this.state.confirmPassword;
    if (confirmNewP) {
      axios
        .post("/api/forgetPasswordRoute/newPassword", json)
        .then(res => {
          console.log("res success status: ", res.data.success);
          if (res.data.success) {
            this.props.history.push("/login");
            this.setState({
              message: "confirm success!"
            });
          } else {
            this.setState({
              message: "The link is expired!"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({ message: "Error, confirmation not exists." });
        });
    } else {
      this.setState({ message: "New password doesn't match!" });
    }
  };
  submitHandler = e => {
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
              this.confirm({
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword
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
