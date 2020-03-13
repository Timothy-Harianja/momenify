import React, { Component } from "react";
import "./accountpage.css";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

class AccountPage extends Component {
  state = {
    userId: null,
    userEmail: null,
    userNickname: null,
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
    message: null
  };
  componentDidMount() {
    axios.get("/api/loginRoute/session").then(res => {
      console.log(res.data);
      this.setState({
        userId: res.data.userId,
        userEmail: res.data.email,
        userNickname: res.data.username
      });
    });
  }

  tryReset = obj => {
    var confirmNewP = this.state.newPassword === this.state.confirmPassword;
    console.log("confirmnewp", confirmNewP);
    if (confirmNewP) {
      axios
        .post("/api/resetPasswordRoute/resetPassword", obj)
        .then(res => {
          if (res.data.success) {
            this.setState({
              message: "password has resetted"
            });
          } else {
            this.setState({ message: " old password is incorrect" });
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
      <div className="account">
        <form onSubmit={this.submitHandler}>
          <h2>Account Information</h2>

          <div className="form-group">
            <label>ID:</label>
            <input
              className="form-control"
              value={this.state.userId}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              className="form-control"
              value={this.state.userEmail}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Nickname</label>
            <input
              className="form-control"
              value={this.state.userNickname}
              disabled
            />
          </div>
        </form>

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
                newPassword: this.state.newPassword
              })
            }
          >
            submit
          </Button>
          {this.state.message == "password has resetted" ? (
            <div id="reset-password-message" style={{ color: "green" }}>
              {this.state.message}
            </div>
          ) : (
            <div id="reset-password-message" style={{ color: "red" }}>
              {this.state.message}
            </div>
          )}
        </form>
      </div>
    );
  }
}

export default AccountPage;
