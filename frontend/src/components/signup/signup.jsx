import React, { Component } from "react";
import "./signup.css";
import axios from "axios";
import Login from "../login/login.jsx";

class Signup extends Component {
  state = {
    id: 123,
    nickname: null,
    password: null,
    email: null
  };

  putDataToUsers = json => {
    console.log("this.json:", json);
    console.log("this.props:", this.props);
    axios
      .post(this.props.api + "/putUser", json)
      .then(res => {
        console.log("res: ", res);
        console.log("res data: ", res.data);

        if (res.data.success) {
          alert("register successed");
        } else {
          alert("failed");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div class="SignUp">
        <form>
          <h3>Sign Up</h3>

          <div className="form-group">
            <label>Nickname</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={e => this.setState({ nickname: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          {/* 
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div> */}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={() => {
              this.putDataToUsers({
                id: this.state.id,
                nickname: this.state.nickname,
                password: this.state.password,
                email: this.state.email
              });
            }}
          >
            Sign Up
          </button>
          <p className="forgot-password text-right">
            Already registered{" "}
            <a
              href="#login"
              onSelect={() => {
                this.props.setBody(<Login />);
              }}
            >
              sign in?
            </a>
          </p>
        </form>
      </div>
    );
  }
}

export default Signup;
