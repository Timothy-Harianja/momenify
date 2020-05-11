import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import io from "socket.io-client";

// let socket;

class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatters: [],
      messageList: [],
      userID: null,
      roomList: [],
      selectedInfo: ["", "", []], //[receiverName, receiverId,showing message]
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
          if (res.data.chatters.length != 0) {
            //default chat room when enter
            let convert = this.covertType(res.data.messageList);
            let messageList = convert;
            this.setState({
              chatters: res.data.chatters,
              messageList: messageList,
              roomList: res.data.roomList,
              // menuItems: this.Menu(res.data.chatters, res.data.chatters[0][0]),
              selectedInfo: [
                res.data.chatters[0][0],
                res.data.chatters[0][1],
                res.data.messageList[0],
              ],
            });
            // console.log("chatters:", this.state.chatters);
            // console.log("messageList:", this.state.messageList);
          } else {
            console.log("oops, you haven't chat with anyone");
          }
        });
      }
    });
  }

  makeToken = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  covertType = (input) => {
    let retMessages = input.map((m) => {
      let meg = m.map((n) => {
        let id = this.makeToken(10);
        let author = n[0];
        let message = n[1];
        let timestamp = n[2];
        return {
          id: id,
          author: author,
          message: message,
          timestamp: timestamp,
        };
      });
      return meg;
    });
    console.log("retMessage", retMessages);
    return retMessages;
  };
  //when click the scroll, show all messages with him
  setupSocket = () => {
    socket = io();
  };

  onSelectChatter = (receiverId) => {
    console.log("receiverid in onSelectChatter:", receiverId);
    //find name, id and message  findIndex
    let theChatter = "";
    let chatters = this.state.chatters;
    chatters.map((chatter) => {
      if (chatter.includes(receiverId)) {
        console.log("found the chatter");
        theChatter = chatter;
      }
    });

    let i = chatters.findIndex((ch) => ch == theChatter);
    this.setState({
      selectedInfo: [theChatter[0], theChatter[1], this.state.messageList[i]],
    });
    console.log("selectedInfo after onselectchatter,", this.state.selectedInfo);
    return true;
  };

  render() {
    console.log("got here");
    return (
      <div>
        <ScrollBar
          chatters={this.state.chatters}
          selected={this.state.selected}
          onSelectChatter={(e) => this.onSelectChatter(e)}
          selectedInfo={this.state.selectedInfo}
          setupSocket={() => this.setupSocket()}
        />
        <MessageList
          messageList={this.state.messageList}
          MY_USER_ID={this.state.userID}
          selectedInfo={this.state.selectedInfo}
        />
      </div>
    );
  }
}

export default Messenger;
