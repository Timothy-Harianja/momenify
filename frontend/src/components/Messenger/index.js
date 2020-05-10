import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";

class Messenger extends Component {
  state = {
    userID: null,
    chatters: [],
    messageList: [],
    roomList: [],
  };
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

// export default function Messenger(props) {
//   return (
//     <div>
//       {/* <div className="scrollable content"> */}
//       <ScrollBar />
//       <MessageList />
//       {/* </div> */}
//     </div>
//   );
// }
