import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import io from "socket.io-client";
let socket;

class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatters: [],
      messageList: [],
      userID: null,
      roomList: [],
    };
  }

  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      if (res.data.uniqueID == null || res.data.email == null) {
        this.props.history.push("/login");
      } else {
        this.setState({ userID: res.data.userId });
        axios.get("/api/config/getMessage").then((res) => {
          console.log("res from get message: ", res);
          this.setState({
            chatters: res.data.chatters,
            messageList: res.data.messageList,
            roomList: res.data.roomList,
          });
        });
      }
    });
  }

  //when click the scroll, show all messages with him
  scrollBarClick = () => {
    socket = io();
  };
  render() {
    return (
      <div>
        {/* <div className="scrollable content"> */}
        <ScrollBar />
        <MessageList />
        {/* </div> */}
      </div>
    );
  }
}

export default Messenger;
