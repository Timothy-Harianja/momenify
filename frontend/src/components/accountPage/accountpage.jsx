import React, { Component } from "react";
import "./accountpage.css";
import axios from "axios";

class AccountPage extends Component {
  state = {
    userId: null,
    userEmail: null,
    userNickname: null
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
      </div>
    );
  }
}

export default AccountPage;
