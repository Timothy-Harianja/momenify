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
    uniqueID: null,
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  putDataToUsers = (json) => {
    var checkAll = true;
    if (this.state.nickname == null || this.state.nickname.trim() == "") {
      checkAll = false;
      this.setState({ message: "Nickname cannot be empty" });
    }

    if (this.state.email) {
      //not null
      if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        checkAll = false;
      }
    } else {
      //null
      checkAll = false;
      this.setState({ message: "Email cannot be empty" });
    }

    if (this.state.password.length < 8) {
      checkAll = false;
      this.setState({ message: "Password must have 8 characters" });
    }

    if (!(this.state.ReEnterPassword == this.state.password)) {
      checkAll = false;
      this.setState({ message: "Password doesn't match" });
    }

    if (this.state.uniqueID == null || this.state.uniqueID.length < 3) {
      checkAll = false;
      this.setState({ message: "Unique must be greater than 3 characters" });
    }

    if (checkAll) {
      axios
        .post("/api/signupRoute/putUser", json)
        .then((res) => {
          if (res.data.success) {
            // this.props.setConfirmationContent(this.state.content);
            this.props.history.push("/confirmation");
          } else {
            this.setState({
              message: res.data.message,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
              required
              type="text"
              className="form-control"
              placeholder="A name that everyone can see"
              onChange={(e) => this.setState({ nickname: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              Unique ID
              <span style={{ fontSize: 10, color: "grey" }}>
                -The ID cannot be changed in future
              </span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              placeholder="Pick a unique ID for your account"
              onChange={(e) => this.setState({ uniqueID: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              required
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              required
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Re-enter Password</label>
            <input
              required
              type="password"
              className="form-control"
              placeholder="Re-enter Password"
              onChange={(e) =>
                this.setState({ ReEnterPassword: e.target.value })
              }
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
                uniqueID: this.state.uniqueID,
                activeToken: makeToken(30),
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
