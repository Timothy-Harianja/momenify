import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

class Login extends Component {
  state = {
    email: null,
    password: null,
    message: null,
  };

  tryLogin = (obj) => {
    axios
      .post("/api/loginRoute/login", obj)
      .then((res) => {
        if (res.data.success == true) {
          // this.props.history.push("/");
          window.location = "/";
        } else {
          this.setState({
            message:
              "Password is incorrect or the account is not activated yet",
          });
          // console.log("password not correct:v", res.data.emailStatus);
          // this.setState({
          //   passwordStatus: <span id="alert">{res.data.passwordStatus}</span>
          // });
          // alert(
          //   "password does not matches or the account is not yet activated!"
          // );
        }
      })
      .catch((err) => {
        console.log("error of catch:", err);
      });
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.submitHandler}>
          <h1>Login</h1>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              id="loginemail"
              //   value=""
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
              id="loginpassword"
              type="password"
            />
          </FormGroup>
          <Button
            className="btn btn-primary btn-block"
            type="submit"
            onClick={() =>
              this.tryLogin({
                email: this.state.email,
                password: this.state.password,
              })
            }
          >
            Login
          </Button>
          <p className="forgot-password text-right">
            <a
              href="/forgetPassword"
              // onSelect={() => {
              //   this.props.setBody(
              //     <resetPassword  />
              //   );
              // }}
            >
              Forget password?
            </a>
          </p>
          <div id="login-message">{this.state.message}</div>
        </form>
      </div>
    );
  }
}

export default Login;
