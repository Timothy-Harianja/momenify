import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";
import axios from "axios";

class Login extends Component {
  state = { email: null, password: null };

  tryLogin = obj => {
    console.log("obj", obj);
    console.log("props: ", this.props);
    axios
      .post("http://localhost:3001" + "/login", obj)
      .then(res => {
        if (res.data.success == true) {
          alert("password matches");
        } else {
          alert(
            "password does not matches or the account is not yet activated!"
          );
        }
      })
      .catch(err => {
        console.log("error of catch:", err);
      });
  };

  submitHandler = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.submitHandler}>
          <h3>Login</h3>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              //   value=""
              onChange={e => this.setState({ email: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              //   value={password}
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
            />
          </FormGroup>
          <Button
            type="submit"
            onClick={() =>
              this.tryLogin({
                email: this.state.email,
                password: this.state.password
              })
            }
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;
