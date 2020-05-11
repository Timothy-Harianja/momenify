import React, { Component } from "react";
import "./signup.css";
import axios from "axios";
import Login from "../login/login.jsx";
import ProgressBar from "react-bootstrap/ProgressBar";

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
    progress: null,
    logoURL: "https://momenify.s3.us-east-2.amazonaws.com/default.png",
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

  onChange = (e) => {
    if (e.target.files.length > 0 && e.target.files[0].size <= 50000000) {
      this.setState({
        userLogo: e.target.files[0],
      });
    } else {
      alert("Please select a file that is less than 50MB!");
    }
    document.getElementById("signup").setAttribute("disabled", true);

    setTimeout(() => {
      const formData = new FormData();
      formData.append("myFiles", this.state.userLogo);
      axios
        .post("/api/config/uploadLogo", formData, {
          onUploadProgress: (progressEvent) => {
            this.setState({
              progress: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              ),
            });
          },
        })
        .then((res) => {
          console.log("res from upload logo: ", res);
          document.getElementById("signup").removeAttribute("disabled");
          if (res.data.success) {
            this.setState({
              progress: null,
              logoURL: res.data.imageLocation,
            });
          }
        });
    }, 500);
  };

  render() {
    return (
      <div className="SignUp">
        <form onSubmit={this.submitHandler}>
          <h1>Sign Up</h1>

          <div className="form-group">
            <label>Nickname</label>
            <input
              id="signupname"
              required
              type="text"
              className="form-control"
              placeholder="A name that everyone can see"
              onChange={(e) => this.setState({ nickname: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              ID
              <span style={{ fontSize: 10, color: "grey" }}>
                -The ID cannot be changed in future
              </span>
            </label>
            <input
              required
              id="signupid"
              type="text"
              className="form-control"
              placeholder="Pick a unique ID"
              onChange={(e) => this.setState({ uniqueID: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              required
              id="signupemail"
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
              id="signuppassword"
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
              id="signupconfirmpassword"
              type="password"
              className="form-control"
              placeholder="Re-enter Password"
              onChange={(e) =>
                this.setState({ ReEnterPassword: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <img className="side-profile" src={this.state.logoURL} />
            <br></br>
            <div class="file btn btn-lg btn-light" id="updatebutton">
              Upload a logo(optional)
              <input
                id="file"
                type="file"
                accept="image/*"
                name="selectedFile"
                onChange={(event) => this.onChange(event)}
              />
            </div>
          </div>
          {this.state.progress != null && this.state.progress <= 100 ? (
            <div style={{ width: "100%" }}>
              Uploading:
              <ProgressBar
                label={
                  this.state.progress == 100
                    ? "Almost done"
                    : this.state.progress + "%"
                }
                animated
                now={this.state.progress}
              />
            </div>
          ) : (
            <span></span>
          )}
          <br></br>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            id="signup"
            onClick={() => {
              this.putDataToUsers({
                nickname: this.state.nickname,
                password: this.state.password,
                email: this.state.email,
                activation: this.state.activation,
                lastLogin: makeTime(),
                uniqueID: this.state.uniqueID,
                activeToken: makeToken(30),
                logoURL: this.state.logoURL,
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
