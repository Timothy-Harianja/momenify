import React, { Component } from "react";
import "./signup.css";
import axios from "axios";
import Login from "../login/login.jsx";

function makeTime() {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  return month + "-" + date + "-" + year;
}

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

class Signup extends Component {
  state = {
    nickname: null,
    password: null,
    ReEnterPassword: null,
    email: null,
    activation: false,
    activeToken: null,
    activeTokenExpire: null,
    lastLogin: null,
    content:
      "Xingyu LiuAn confirmation link has been sent to your email, please activate in 24 hours!"
  };

  submitHandler = e => {
    e.preventDefault();
  };

  putDataToUsers = json => {
    var checkAll = true;
    if (this.state.nickname == null) {
      checkAll = false;
      this.setState({ message: "Nichname cannot be empty" });
    }

    if (this.state.email) {
      //not null
      if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        checkAll = false;
        console.log("email incorrect");
      }
    } else {
      //null
      checkAll = false;
      this.setState({ message: "email cannot be empty" });
    }

    if (!(this.state.ReEnterPassword == this.state.password)) {
      checkAll = false;
      console.log("password doesn't match");
      this.setState({ message: "Password doesn't match" });
    }

    if (checkAll) {
      console.log("this.json:", json);
      console.log("this.props:", this.props);
      axios
        .post("/api/signupRoute/putUser", json)
        .then(res => {
          console.log("res: ", res);
          console.log("res data: ", res.data);

          if (res.data.success) {
            // this.props.setConfirmationContent(this.state.content);
            this.props.history.push("/confirmation");
          } else {
            this.setState({
              message: "This email has already registered"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("somthing is wrong");
    }
  };

  render() {
    return (
      <div className="SignUp">
        <form onSubmit={this.submitHandler}>
          <h1>Sign Up</h1>

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
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Re-enter Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter Password"
              onChange={e => this.setState({ ReEnterPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={() => {
              this.putDataToUsers({
                nickname: this.state.nickname,
                password: this.state.password,
                email: this.state.email,
                activation: this.state.activation,
                lastLogin: makeTime(),
                activeToken: makeToken(30),
                activeTokenExpire: new Date().getTime() + 24 * 60 * 60 * 1000
              });
            }}
          >
            Sign Up
          </button>
          <p className="forgot-password text-right">
            Already registered{" "}
            <a
              href="/login"
              onSelect={() => {
                this.props.setBody(<Login />);
              }}
            >
              sign in?
            </a>
          </p>
          <div style={{ color: "red", textAlign: "center" }}>
            {this.state.message}
          </div>
        </form>
      </div>
    );
  }
}

export default Signup;
