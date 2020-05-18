import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import Message from "../Message";
import moment from "moment";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import io from "socket.io-client";
let socket;

//this is hard code message date check: if date very close, regard it as one message, therefore don't display the second message
//elem:[sender, date]
let checkSameMessage = [];
class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      chatters: [], //elem: [name,id]
      messageList: [], //elem: [sender id,message, timestamp]
      userID: null,
      roomList: [], //elem: roomId
      selectedInfo: ["", "", []], //[receiverName, receiverId,showing message]
      testNumber: 1,
      pendingList: [], //elem: {roomId,pendingNumber }
    };
  }

  componentDidMount() {
    axios
      .get("/api/loginRoute/session")
      .then((res) => {
        if (res.data.uniqueID == null || res.data.email == null) {
          this.props.history.push("/login");
        } else {
          this.setState({ userID: res.data.userId });
          axios.get("/api/config/getMessage").then((res) => {
            // console.log("res from get message: ", res);
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
              // initial socket.io for each person
              socket = io();
              this.setupSocket();
            } else {
              console.log("oops, you haven't chat with anyone");
            }
          });
        }
      })
      .then(() => {
        let receiverId = this.state.userID;
        console.log("axios getpendingnumber receiverId:", receiverId);
        axios
          .post("/api/config/getPendingNumber", { receiverId: receiverId })
          .then((res) => {
            // console.log("res.data.pendinglist:", res.data.pendingList);
            if (res.data.success) {
              console.log("res.data.pendingList:", res.data.pendingList);
              this.setState({ pendingList: res.data.pendingList });
            } else {
              console.log("err find the pendingmessage");
            }
          });
      });


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

  setupSocket = () => {
    console.log("setup socket: receiver", this.state.selectedInfo[1]);
    let receiver = this.state.selectedInfo[1];
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == receiver
    );

    let name = this.state.userID;
    // let roomId = this.state.roomList[index];
    console.log("WHAT IS ROOMLIST IN STATE:", this.state.roomList);
    for (let i = 0; i < this.state.roomList.length; i++) {
      let roomId = this.state.roomList[i];
      socket.emit("join", { name, roomId }, (err) => {
        if (err) {
          console.log("err in join: ", err);
        }
      });
    }

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
          // console.log(
          //   "the time between two message:",
          //   Math.abs(date - preDate)
          // );
          if (preUser == sender && Math.abs(date - preDate) <= 180) {
            // console.log("the two post are the same, do nothing");
          } else {
            // console.log("time not big enough");
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
    console.log("receiverid in onSelectChatter:", receiverId);
    console.log("receiverid this.state.chatters:", this.state.chatters);

    //first thing update the pending number
    this.resetPendNum(receiverId);
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
    console.log("the i:", i);
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

      // this.switchRoom({
      //   userId: this.state.userID,
      //   roomId: this.state.roomList[i],
      // });
    });

    // this.setupSocket();

    // console.log("selectedInfo after onselectchatter,", this.state.selectedInfo);
    return true;
  };

  switchRoom = ({ userId, roomId }) => {
    console.log("switchRoom happened");
    socket.emit("switchRoom", { userId, roomId }, (callback) => {});
  };

  renderMessages = (messages) => {
    //check messageList undefined
    // let messages = [];

    // if (
    //   this.state.messageList != undefined &&
    //   this.state.messageList.length != 0
    // ) {
    //   // console.log("selectedInfo ", this.state.selectedInfo);
    //   // console.log(" selectedInfo[2] ", this.state.selectedInfo[2]);
    //   // messages = this.state.selectedInfo[2];
    //   // console.log("messages length: ", messages.length);
    // }
    // console.log("messages", messages);
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

    /*lastly, update new message icon: +1*/
    this.addOnePend(sender);
    // this.setState({ messageList: newMessageList });

    if (sender == selected[1]) {
      let newRenderedMessages = this.renderMessages(newMessageList[index]);
      selected[2] = newRenderedMessages;
      this.setState({ selectedInfo: selected, messageList: newMessageList });
    }
    return true;
  };

  sendMessage = ({ newMessage, sender }) => {
    /*if the sender is not my userid, it means this message is from
      socket, all to do is display it to frontend and updates all
      local states, no more socket.emit update to backend since already 
      done by the the sender */
    if (sender != this.state.userID) {
      console.log("should not have this");

      console.log("sender: ", sender);
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
      // console.log("newMessagddddddd:", newMessage);

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
      let sendMessageSuccess = false;
      let roomId = this.state.roomList[index];
      socket.emit(
        "sendMessage",
        { sender, receiver, message, roomId },
        (callback) => {
          console.log(callback);
          console.log("emit sendmessage:", callback.success);
          sendMessageSuccess = callback.success;
          console.log("sendMessageSuccess after emit:", sendMessageSuccess);
          roomId = callback.roomId;

          console.log("sendMessageSuccess:  ", sendMessageSuccess);
          console.log("roomId: ", roomId);
          if (!sendMessageSuccess) {
            axios
              .post("/api/config/pendingMessage", {
                receiverId: receiver,
                roomId: roomId,
              })
              .then((res) => {
                console.log("res.data", res.data);
                if (res.data.success) {
                  console.log("pending message update success");
                } else {
                  console.log("pending message update failed");
                }
              });
          }
        }
      );

      console.log("sendMessageSuccess:  ", sendMessageSuccess);
      socket.emit("sendMessage", { sender, receiver, message }, (callback) => {
        console.log("callback: ", callback);
      });

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

      // if sendMessageSuccess = false, update pendingMessage backend

      //hardcoded promise
      let pro = new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve("promise end");
        }, 1000);
      });
      pro.then(() => {
        // console.log("promise 2");
        // console.log("sendMessageSuccess:  ", sendMessageSuccess);
        // console.log("roomId: ", roomId);
        // if (!sendMessageSuccess) {
        //   axios
        //     .post("/api/config/pendingMessage", {
        //       receiverId: receiver,
        //       roomId: roomId,
        //     })
        //     .then((res) => {
        //       console.log("res.data", res.data);
        //       if (res.data.success) {
        //         console.log("pending message update success");
        //       } else {
        //         console.log("pending message update failed");
        //       }
        //     });
        // }
      });

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

  getPendNum = (chatterId) => {
    console.log("roomlist:", this.state.roomList);
    console.log("getpendnum chatterId: ", chatterId);
    //edge case
    if (this.state.pendingList.length == 0) {
      return 0;
    }
    //find the room number
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == chatterId
    );
    console.log("getpendNum index", index);
    let roomId = this.state.roomList[index];
    console.log("getpendNum roomId", roomId);

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );
    if (numIndex != -1) {
      let num = this.state.pendingList[numIndex][1];
      if (num == 0) {
        console.log("pending num is 0");
        return 0;
      }
      return num;
    }
    //don't have any pending message
    console.log("don't have any pending message");
    return 0;
  };

  resetPendNum = (chatterId) => {
    //edge case
    if (this.state.pendingList.length == 0) {
      return true;
    }

    //find the room number
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == chatterId
    );
    console.log("chatterId: ", chatterId);
    console.log("this.state.roomlist: ", this.state.roomList);
    console.log("resetpendNum index", index);
    let roomId = this.state.roomList[index];
    console.log("resetpendNum roomId", roomId);

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );
    if (numIndex != -1) {
      // update local, update backend
      let newPendingList = this.state.pendingList;
      newPendingList[numIndex][1] = 0;
      this.setState({ pendingList: newPendingList });
      axios
        .post("/api/config/processingMessage", {
          receiverId: this.state.userID,
          roomId: roomId,
        })
        .then((res) => {
          console.log("processing message res.data:", res.data);
          if (res.data.success) {
            console.log("procesising message backend success");
          } else {
            console.log("procesising message backend failed");
          }
        });
    } else {
      //done nothing?
    }
  };

  addOnePend = (chatterId) => {
    //find the room number
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == chatterId
    );

    let roomId = this.state.roomList[index];
    console.log("resetpendNum roomId", roomId);

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );

    let newPendingList = this.state.pendingList;
    console.log("??????", newPendingList);

    if (numIndex != -1) {
      // update local, update backend
      newPendingList[numIndex][1] += 1;
    } else {
      console.log("??????");
      newPendingList.push([roomId, 1]);
    }
    console.log("??????", newPendingList);
    this.setState({ pendingList: newPendingList });
    axios
      .post("/api/config/pendingMessage", {
        receiverId: this.state.userID,
        roomId: roomId,
      })
      .then((res) => {
        console.log("addOnePend res.data:", res.data);
        if (res.data.success) {
          console.log("addOnePend  backend success");
        } else {
          console.log("addOnePend backend failed");
        }
      });
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
          testNumber={this.state.testNumber}
          getPendNum={(chatterId) => this.getPendNum(chatterId)}
        />
        <MessageList
          messageList={this.state.messageList}
          MY_USER_ID={this.state.userID}
          selectedInfo={this.state.selectedInfo}
          sendMessage={(newMessage) => this.sendMessage(newMessage)}
          // renderMessages={() => this.renderMessages()}
        />
        {/* <ScrollUpButton /> */}
      </div>
    );
  }
}

export default Messenger;
