import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import Message from "../Message";
import moment from "moment";

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
      selectedInfo: ["", "", []], //[receiverName, receiverId,showing message]
      socketList: [],
      // renderedMessage: [],
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

            // let convert = this.covertType(res.data.messageList);
            // let messageList = convert;
            this.setState({
              chatters: res.data.chatters,
              messageList: res.data.messageList,
              roomList: res.data.roomList,
              // menuItems: this.Menu(res.data.chatters, res.data.chatters[0][0]),
              selectedInfo: [
                res.data.chatters[0][0],
                res.data.chatters[0][1],
                this.renderMessages(res.data.messageList[0], true),
              ],
            });
            // console.log("chatters:", this.state.chatters);
            // console.log("messageList:", this.state.messageList);
            // initial socket.io for each person
            socket = io();
          } else {
            console.log("oops, you haven't chat with anyone");
          }
        });
      }
    });
  }

  // initSocket = () => {
  //   let chatters = this.state.chatters;
  //   let roomList = this.state.roomList;
  //   console.log("chatters,", chatters);
  //   console.log("roomList,", roomList);

  //   for (let i = 0; i < chatters.length; i++) {}
  // };

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
    // console.log("retMessage", retMessages);
    return retMessages;
  };
  //when click the scroll, show all messages with him
  setupSocket = () => {
    let socket = io();
  };

  onSelectChatter = (receiverId) => {
    // console.log("receiverid in onSelectChatter:", receiverId);
    //find name, id and message  findIndex
    let theChatter = "";
    let chatters = this.state.chatters;
    chatters.map((chatter) => {
      if (chatter.includes(receiverId)) {
        // console.log("found the chatter");
        theChatter = chatter;
      }
    });

    let i = chatters.findIndex((ch) => ch == theChatter);
    this.setState({
      selectedInfo: [
        theChatter[0],
        theChatter[1],
        this.renderMessages(this.state.messageList[i]),
      ],
    });
    // console.log("selectedInfo after onselectchatter,", this.state.selectedInfo);
    return true;
  };

  renderMessages = (messages, isInit) => {
    //check messageList undefined
    // let messages = [];

    if (
      this.state.messageList != undefined &&
      this.state.messageList.length != 0
    ) {
      // console.log("selectedInfo ", this.state.selectedInfo);

      // console.log(" selectedInfo[2] ", this.state.selectedInfo[2]);
      // messages = this.state.selectedInfo[2];
      console.log("messages length: ", messages.length);
    }
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];
    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      console.log("what is current[0]?|", current[0], "|");
      console.log("what is  this.srID?|", this.state.userID, "|");
      console.log("equal?", current[0] == this.state.userID);

      let next = messages[i + 1];
      let isMine = current[0] == this.state.userID;
      let currentMoment = moment(current[2]);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous[2]);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous[0] === current[0];

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next[2]);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next[0] === current[0];

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }
      current = {
        id: i,
        author: current[0],
        message: current[1],
        timestamp: current[2],
      };
      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }
    tempMessages = tempMessages.reverse();

    return tempMessages;
  };

  sendMessage = (newMessage) => {
    // newMessage.preventDefault();
    console.log("newMessagddddddd:", newMessage);

    let selected = this.state.selectedInfo;
    let receiverName = selected[0];
    let receiverId = selected[1];

    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == receiverId
    );
    let newMessageList = this.state.messageList;
    console.log("newmessageList", newMessageList);
    newMessageList[index] = [
      [this.state.userID, newMessage, new Date().getTime()],
      ...newMessageList[index],
    ];

    let newRenderedMessages = this.renderMessages(newMessageList[index], false);
    selected[2] = newRenderedMessages;

    console.log("newmessageList after", newMessageList);

    this.setState({ selectedInfo: selected, messageList: newMessageList });
    console.log("after setstate");

    //then update backend
    axios
      .post("/api/config/message", {
        sender: this.state.userID,
        receiver: receiverId,
        message: newMessage,
      })
      .then((res) => {});
  };

  render() {
    // console.log("got here");
    return (
      <div>
        <ScrollBar
          chatters={this.state.chatters}
          selected={this.state.selected}
          onSelectChatter={(e) => this.onSelectChatter(e)}
          selectedInfo={this.state.selectedInfo}
          // setupSocket={() => this.setupSocket()}
        />
        <MessageList
          messageList={this.state.messageList}
          MY_USER_ID={this.state.userID}
          selectedInfo={this.state.selectedInfo}
          sendMessage={(newMessage) => this.sendMessage(newMessage)}
          // renderMessages={() => this.renderMessages()}
        />
      </div>
    );
  }
}

export default Messenger;
