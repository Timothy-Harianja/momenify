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
      scrollList: [],
      messageList: [],
    };
  }

  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      if (res.data.uniqueID == null || res.data.email == null) {
        this.props.history.push("/login");
      }
    });
    // gets all user's following people, add to scroll list
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
