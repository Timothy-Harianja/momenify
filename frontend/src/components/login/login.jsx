import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";
class Login extends Component {
  render() {
    return (
      <div className="Login">
        <form>
          <h3>Login</h3>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              //   value=""
              //   onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              //   value={password}
              //   onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </FormGroup>
          <Button block bsSize="large" type="submit">
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;
