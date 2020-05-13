import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import Message from "../Message";
import moment from "moment";

import io from "socket.io-client";
let socket;

//this is hard code message date check: if date very close, regard it as one message, therefore don't display the second message
//elem:[sender, date]
let checkSameMessage = [];
class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatters: [], //elem: [name,id]
      messageList: [], //elem: [sender id,message, timestamp]
      userID: null,
      roomList: [], //elem: roomId
      selectedInfo: ["", "", []], //[receiverName, receiverId,showing message]
      // socketList: [],
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
                this.renderMessages(res.data.messageList[0]),
              ],
            });
            // console.log("chatters:", this.state.chatters);
            // console.log("messageList:", this.state.messageList);
            // initial socket.io for each person
            socket = io("http://localhost:3000");
            this.setupSocket();
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
  // covertType = (input) => {
  //   let retMessages = input.map((m) => {
  //     let meg = m.map((n) => {
  //       let id = this.makeToken(10);
  //       let author = n[0];
  //       let message = n[1];
  //       let timestamp = n[2];
  //       return {
  //         id: id,
  //         author: author,
  //         message: message,
  //         timestamp: timestamp,
  //       };
  //     });
  //     return meg;
  //   });
  //   // console.log("retMessage", retMessages);
  //   return retMessages;
  // };

  setupSocket = () => {
    //socket.emit()
    let receiver = this.state.selectedInfo[1];
    // console.log("receiver:  ", receiver);
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == receiver
    );
    // console.log("this.state.roomList[index]:", this.state.roomList[index]);
    // console.log("this.state.roomList:", this.state.roomList);
    // console.log("what is index?", index);
    let name = this.state.userID;
    let roomInfo = [this.state.roomList[index], name, receiver];
    // console.log("name", name);
    // console.log("roomInfo", roomInfo);
    socket.emit("join", { name, roomInfo }, (err) => {
      if (err) {
        console.log("err in join: ", err);
      }
    });
    socket.on("message", (message) => {
      let sender = message.user;
      let text = message.text;
      console.log("the message I received", message);
      // console.log("the sender in socket.on message: ", sender);
      if (sender != this.state.userID) {
        if (checkSameMessage.length != 0) {
          console.log("first sent already");
          let date = new Date().getTime();
          //compare sender and date
          let preUser = checkSameMessage[0];
          let preDate = checkSameMessage[1];
          checkSameMessage[0] = sender;
          checkSameMessage[1] = date;
          console.log(
            "the time between two message:",
            Math.abs(date - preDate)
          );
          if (preUser == sender && Math.abs(date - preDate) <= 180) {
            console.log("the two post are the same, do nothing");
          } else {
            console.log("time not big enough");
            this.getMessageFromOther({ newMessage: text, sender: sender });
          }
        } else {
          console.log("no one send yet");
          let date = new Date().getTime();
          checkSameMessage.push(sender);
          checkSameMessage.push(date);
          this.getMessageFromOther({ newMessage: text, sender: sender });
        }
      }
    });
  };

  useEffect = () => {
    console.log("useEffect...");

    socket.on("roomData", ({ users }) => {
      // setUsers(users);
    });
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
    let pro = new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve("promise end");
      }, 25);
    });
    pro.then(() => {
      // console.log(message);
      console.log("next");
      this.setupSocket();
    });

    // this.setupSocket();

    // console.log("selectedInfo after onselectchatter,", this.state.selectedInfo);
    return true;
  };

  renderMessages = (messages) => {
    //check messageList undefined
    // let messages = [];

    if (
      this.state.messageList != undefined &&
      this.state.messageList.length != 0
    ) {
      // console.log("selectedInfo ", this.state.selectedInfo);
      // console.log(" selectedInfo[2] ", this.state.selectedInfo[2]);
      // messages = this.state.selectedInfo[2];
      // console.log("messages length: ", messages.length);
    }
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];
    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];

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

  getMessageFromOther = ({ newMessage, sender }) => {
    /*if the sender is not my userid, it means this message is from
      socket, all to do is display it to frontend and updates all
      local states, no more socket.emit update to backend since already 
      done by the the sender */
    // console.log("called twice?");
    let selected = this.state.selectedInfo;
    // console.log("the sender in socket.on message: ", sender);
    // console.log("the chatters in state:", this.state.chatters);
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == sender
    );

    // console.log("index in send message,", index);
    let newMessageList = this.state.messageList;
    newMessageList[index] = [
      [sender, newMessage, new Date().getTime()],
      ...newMessageList[index],
    ];
    let newRenderedMessages = this.renderMessages(newMessageList[index]);
    selected[2] = newRenderedMessages;
    this.setState({ selectedInfo: selected, messageList: newMessageList });
    return true;
  };

  sendMessage = ({ newMessage, sender }) => {
    /*if the sender is not my userid, it means this message is from
      socket, all to do is display it to frontend and updates all
      local states, no more socket.emit update to backend since already 
      done by the the sender */
    if (sender != this.state.userID) {
      console.log("should not have this");
      // let selected = this.state.selectedInfo;
      // console.log("the sender in socket.on message: ", sender);
      // console.log("the chatters in state:", this.state.chatters);
      // let index = this.state.chatters.findIndex(
      //   (chatter) => chatter[1] == sender
      // );
      // console.log("index in send message,", index);
      // let newMessageList = this.state.messageList;
      // newMessageList[index] = [
      //   [sender, newMessage, new Date().getTime()],
      //   ...newMessageList[index],
      // ];
      // let newRenderedMessages = this.renderMessages(newMessageList[index]);
      // selected[2] = newRenderedMessages;
      // this.setState({ selectedInfo: selected, messageList: newMessageList });
      // return true;
    } else {
      // newMessage.preventDefault();
      console.log("newMessagddddddd:", newMessage);

      let selected = this.state.selectedInfo;
      let receiverName = selected[0];
      let receiverId = selected[1];

      let index = this.state.chatters.findIndex(
        (chatter) => chatter[1] == receiverId
      );

      // socket send message
      // let sender = this.state.userID;
      let message = newMessage;
      let receiver = receiverId;
      // console.log("newMessage", newMessage);
      socket.emit("sendMessage", { sender, receiver, message }, () => {});

      let newMessageList = this.state.messageList;
      // console.log("newmessageList", newMessageList);
      newMessageList[index] = [
        [this.state.userID, newMessage, new Date().getTime()],
        ...newMessageList[index],
      ];

      let newRenderedMessages = this.renderMessages(newMessageList[index]);
      selected[2] = newRenderedMessages;

      // console.log("newmessageList after", newMessageList);

      this.setState({ selectedInfo: selected, messageList: newMessageList });
      // console.log("after setstate");

      //then update backend
      axios
        .post("/api/config/message", {
          sender: this.state.userID,
          receiver: receiverId,
          message: newMessage,
        })
        .then((res) => {
          if (res.data.success) {
            console.log("message sent");
          }
        });
      return true;
    }
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
          userID={this.state.userID}
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
