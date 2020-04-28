import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./post-dropdown.css";
import axios from "axios";

class PostDropdown extends React.Component {
  state = {
    userid: this.props.userid,
    followStatus: this.props.followStatus,
  };

  follow = () => {
    console.log("userid be followed is null?: ", this.state.userid == null);
    if (this.state.userid != null) {
      axios
        .post("/api/followChangeRoute/follow", { userid: this.state.userid })
        .then((res) => {
          console.log("res of follow: ", res.data);
          if (
            res.data.success ||
            res.data.message.includes("followed this user")
          ) {
            console.log(res.data.message);
            this.setState({ followStatus: true });
            this.props.changeFollowStatus(true);
            this.props.updateFollow(this.state.id);
          } else {
            console.log(res.data.message);
            this.setState({ followStatus: false });
            this.props.changeFollowStatus(false);
          }
        });
      //not anonymous
    } else {
      console.log("user to be followed not exist.");
    }
  };
  unfollow = () => {
    console.log("userid to unfollow is null?: ", this.state.userid == null);
    if (this.state.userid != null) {
      axios
        .post("/api/followChangeRoute/unfollow", { userid: this.state.userid })
        .then((res) => {
          console.log("res of unfollow: ", res.data);
          if (res.data.success || res.data.message.includes("You unfollowed")) {
            console.log(res.data.message);
            this.setState({ followStatus: false });
            this.props.changeFollowStatus(false);
            this.props.updateFollow(this.state.id);
          } else {
            console.log(res.data.message);
            this.setState({ followStatus: true });
            this.props.changeFollowStatus(true);
          }
        });
    } else {
      console.log("user to unfollowed not exist.");
    }
  };
  render() {
    return (
      <Dropdown classname="dropdown">
        <Dropdown.Toggle
          className="dropdown-toggle"
          variant=""
          id="dropdown-basic"
        >
          <svg
            class="bi bi-justify"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M2 12.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"
              clip-rule="evenodd"
            />
          </svg>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu">
          <Dropdown.Item>
            <svg
              class="bi bi-person-plus"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM6 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm4.5 0a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1H13V5.5a.5.5 0 01.5-.5z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M13 7.5a.5.5 0 01.5-.5h2a.5.5 0 010 1H14v1.5a.5.5 0 01-1 0v-2z"
                clip-rule="evenodd"
              />
            </svg>
            {this.state.followStatus ? (
              <span onClick={() => this.unfollow()}>unfollow</span>
            ) : (
              <span onClick={() => this.follow()}>Follow</span>
            )}
          </Dropdown.Item>
          <Dropdown.Item>
            <svg
              class="bi bi-chat"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Message</span>
          </Dropdown.Item>
          <Dropdown.Item>
            <svg
              class="bi bi-x-circle"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Report</span>
          </Dropdown.Item>
          <Dropdown.Item>
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667
                  c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14
                  c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583
                  C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167
                  c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083
                  z"
              ></path>
            </svg>
            <span>Delete</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default PostDropdown;
