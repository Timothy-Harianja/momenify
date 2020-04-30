import React, { Component } from "react";
import "./accountpage.css";
import axios from "axios";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";

class AccountPage extends Component {
  state = {
    userId: null,
    userEmail: null,
    userNickname: null,
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
    message: null,
    userLogo: null,
    currentLogo: null,
    progress: null,
    updateMessage: null,
  };
  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      this.setState({
        userId: res.data.uniqueID,
        userEmail: res.data.email,
        userNickname: res.data.username,
        currentLogo: res.data.logoNumber,
      });
    });
  }

  updateInfo = (obj) => {
    axios.post("/api/config/updateInfo", obj).then((res) => {
      this.setState({
        updateMessage: res.data.message,
      });
    });
  };

  tryReset = (obj) => {
    var confirmNewP = this.state.newPassword === this.state.confirmPassword;

    if (confirmNewP) {
      axios
        .post("/api/resetPasswordRoute/resetPassword", obj)
        .then((res) => {
          if (res.data.success) {
            this.setState({
              message: "password has resetted",
            });
          } else {
            this.setState({ message: " old password is incorrect" });
          }
        })
        .catch((err) => {
          console.log("error of catch:", err);
        });
    } else {
      this.setState({ message: "new password doesn't match" });
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  onChange = (e) => {
    if (e.target.files.length > 0 && e.target.files[0].size <= 50000000) {
      this.setState({
        userLogo: e.target.files[0],
      });
    } else {
      alert("Please select a file that is less than 50MB!");
    }
    document.getElementById("updateInfo").setAttribute("disabled", true);

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
          document.getElementById("updateInfo").removeAttribute("disabled");
          if (res.data.success) {
            this.setState({
              progress: null,
              currentLogo: res.data.imageLocation,
            });
          }
        });
    }, 500);
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
              onChange={(e) => this.setState({ userNickname: e.target.value })}
            />
          </div>
          <p>Current Logo</p>
          <div className="form-group">
            <img className="side-profile" src={this.state.currentLogo} />
            <br></br>
            <div class="file btn btn-lg btn-light" id="updatebutton">
              Change Logo
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

          <Button
            className="btn btn-info btn-block"
            type="submit"
            id="updateInfo"
            onClick={() =>
              this.updateInfo({
                userNickname: this.state.userNickname,
                currentLogo: this.state.currentLogo,
              })
            }
          >
            Update
          </Button>
          {this.state.updateMessage == "Updated!" ? (
            <div id="reset-password-message" style={{ color: "green" }}>
              {this.state.updateMessage}
            </div>
          ) : (
            <div id="reset-password-message" style={{ color: "red" }}>
              {this.state.updateMessage}
            </div>
          )}
        </form>
        <br></br>
        <form onSubmit={this.submitHandler}>
          <h2>Change Password</h2>

          <FormGroup controlId="old-password" bsSize="large">
            <FormLabel>Current Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) => this.setState({ oldPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="new-password" bsSize="large">
            <FormLabel>New Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) => this.setState({ newPassword: e.target.value })}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirm-password" bsSize="large">
            <FormLabel>Confirm New Password </FormLabel>
            <FormControl
              //   value={password}
              onChange={(e) =>
                this.setState({ confirmPassword: e.target.value })
              }
              type="password"
            />
          </FormGroup>
          <Button
            className="btn btn-info btn-block"
            type="submit"
            onClick={() =>
              this.tryReset({
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
              })
            }
          >
            Change Password
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
