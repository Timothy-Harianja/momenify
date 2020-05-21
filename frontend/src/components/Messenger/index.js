import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import Message from "../Message";
import moment from "moment";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import io from "socket.io-client";
import { resolveContent } from "nodemailer/lib/shared";
let socket;

//this is hard code message date check: if date very close, regard it as one message, therefore don't display the second message
//elem:[sender, date]
let checkSameMessage = [];
class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      chatters: [], //elem: [name,id, roomId]  (order matters)
      messageList: [], //elem: {roomId:roomId,messages: [[sender id,message, timestamp]....]} (order matters)
      userID: null,
      selectedInfo: ["", "", []], //[receiverName, receiverId,showing message]
      testNumber: 1,
      pendingList: [], //elem: [roomId,pendingNumber]  (not in order)
      logoList: [], //[userId,logoLink] (order not matter)
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
            if (res.data.chatters.length != 0) {
              //we put roomId into chatters
              let chatters = res.data.chatters;
              let roomIds = res.data.roomList;
              for (let i = 0; i < chatters.length; i++) {
                chatters[i].push(roomIds[i]);
              }
              // console.log("after merge chatters and roomids:", chatters);
              this.setState({
                chatters: chatters,
                messageList: res.data.messageList,
                // roomList: res.data.roomList,
              });

              // initial socket.io
              socket = io();
              this.setupSocket();

              //get logos
              let ids = this.state.chatters.map((chatter) => {
                return chatter[1];
              });
              ids = [this.state.userID, ...ids];
              axios
                .post("/api/postRoute/logos", { ids })
                .then((logoRes) => {
                  if (logoRes.data.success) {
                    this.setState({ logoList: logoRes.data.logoList });
                    //then get pending number
                    let receiverId = this.state.userID;
                    axios
                      .post("/api/config/getPendingNumber", {
                        receiverId: receiverId,
                      })
                      .then((res) => {
                        if (res.data.success) {
                          this.setState({ pendingList: res.data.pendingList });
                          // console.log("res.data.pendingList", res.data.pendingList);
                          if (res.data.pendingList.length != 0) {
                            //here we sort by pendingList
                            this.sortByPend();

                            //now using the sorted lists to render message
                            this.setState({
                              selectedInfo: [
                                this.state.chatters[0][0],
                                this.state.chatters[0][1],
                                this.renderMessages(
                                  this.state.messageList[0].messages
                                ),
                              ],
                            });
                          }
                        }
                      });
                  }
                })
                .then(() => {});
            } else {
              // console.log("oops, you haven't chat with anyone");
            }
          });
        }
      })
      .then(() => {});
  }

  sortByPend = () => {
    let chatters = this.state.chatters;
    let messageList = this.state.messageList;
    let pendingList = this.state.pendingList;
    //first thing first, sort pendinglist by pending number
    pendingList.sort((a, b) => {
      // console.log("a[1]: ", a[1]);
      return a[1] < b[1];
    });
    // console.log("after sort pendinglist:", pendingList);

    /*sort by pendingList: edge case, if pendingList don't find the roomId,
    no pending message, put to the last
    */
    let newChatters = pendingList.map((pending) => {
      let roomId = pending[0];
      let retVal = chatters.find((chatter) => {
        if (chatter[2] == roomId) {
          return chatter;
        }
      });
      // console.log("should see a chatter retVal instead of null:", retVal);
      return retVal;
    });
    /*now it's possible that chatter with no pending message,
     which has not added to newChatters, do it here*/
    for (let i = 0; i < chatters.length; i++) {
      let index = newChatters.findIndex(
        (newChatter) => newChatter[2] == chatters[i][2]
      );
      if (index == -1) {
        // console.log("pushed a chatter");
        newChatters.push(chatters[i]);
      }
    }

    /*now time for messageList*/

    let newMessageList = pendingList.map((pending) => {
      let roomId = pending[0];
      let retVal = messageList.find((m) => {
        if (m.roomId == roomId) {
          return m;
        }
      });
      // console.log("should see a messageList retVal instead of null:", retVal);
      return retVal;
    });
    for (let i = 0; i < chatters.length; i++) {
      let index = newMessageList.findIndex(
        (newM) => newM.roomId == messageList[i].roomId
      );
      if (index == -1) {
        // console.log("pushed a messageList");
        newMessageList.push(messageList[i]);
      }
    }
    this.setState({ chatters: newChatters, messageList: newMessageList });
  };
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
    let receiver = this.state.selectedInfo[1];
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == receiver
    );

    let name = this.state.userID;
    for (let i = 0; i < this.state.chatters.length; i++) {
      let roomId = this.state.chatters[i][2];
      socket.emit("join", { name, roomId }, (err) => {
        if (err) {
          console.log("err in join: ", err);
        }
      });
    }

    socket.on("message", (message) => {
      let sender = message.user;
      let text = message.text;
      if (sender != this.state.userID) {
        if (checkSameMessage.length != 0) {
          let date = new Date().getTime();
          //compare sender and date
          let preUser = checkSameMessage[0];
          let preDate = checkSameMessage[1];
          checkSameMessage[0] = sender;
          checkSameMessage[1] = date;

          if (preUser == sender && Math.abs(date - preDate) <= 180) {
            // console.log("the two post are the same, do nothing");
          } else {
            // console.log("time not big enough");
            this.getMessageFromOther({ newMessage: text, sender: sender });
          }
        } else {
          // console.log("no one send yet");
          let date = new Date().getTime();
          checkSameMessage.push(sender);
          checkSameMessage.push(date);
          this.getMessageFromOther({ newMessage: text, sender: sender });
        }
      }
    });
  };

  useEffect = () => {
    socket.on("roomData", ({ users }) => {
      // setUsers(users);
    });
  };

  onSelectChatter = (receiverId) => {
    //first thing update the pending number
    this.resetPendNum(receiverId);
    //find name, id and message  findIndex
    let theChatter = "";
    let chatters = this.state.chatters;
    chatters.map((chatter) => {
      if (chatter.includes(receiverId)) {
        theChatter = chatter;
      }
    });
    let i = chatters.findIndex((ch) => ch == theChatter);
    // console.log("the i:", i);
    this.setState({
      selectedInfo: [
        theChatter[0],
        theChatter[1],
        this.renderMessages(this.state.messageList[i].messages),
      ],
    });

    return true;
  };

  switchRoom = ({ userId, roomId }) => {
    // console.log("switchRoom happened");
    socket.emit("switchRoom", { userId, roomId }, (callback) => {});
  };

  renderMessages = (messages) => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];
    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let myId = current[0];
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
      //new added: logo
      // console.log("myId:", myId);
      let logoIndex = this.state.logoList.findIndex((logo) => logo[0] == myId);
      // console.log("this.state.logoList:", this.state.logoList);
      let myLogo = this.state.logoList[logoIndex][1];
      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
          myLogo={myLogo}
        />
      );

      // Proceed to the next message.
      i += 1;
    }
    tempMessages = tempMessages.reverse();

    return tempMessages;
  };

  getMessageFromOther = ({ newMessage, sender }) => {
    let selected = this.state.selectedInfo;
    let newChatters = this.state.chatters;
    // let newMessageList  = this.state.messageList;
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == sender
    );

    let newMessageList = this.state.messageList;
    newMessageList[index].messages = [
      [sender, newMessage, new Date().getTime()],
      ...newMessageList[index].messages,
    ];
    /*now we put the sender at the front of chatters and messageList*/

    let frontChatter = newChatters.splice(index, 1);
    newChatters = [frontChatter[0], ...newChatters];
    let frontMessageList = newMessageList.splice(index, 1);
    newMessageList = [frontMessageList[0], ...newMessageList];

    this.setState({ chatters: newChatters, messageList: newMessageList });

    /*lastly, update new message icon: +1*/
    this.addOnePend(sender);

    if (sender == selected[1]) {
      let newRenderedMessages = this.renderMessages(newMessageList[0].messages);
      selected[2] = newRenderedMessages;
      this.setState({ selectedInfo: selected });
    }
    return true;
  };

  sendMessage = ({ newMessage, sender }) => {
    if (sender != this.state.userID) {
      // console.log("should not have this");
    } else {
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
      let roomId = this.state.chatters[index][2];
      socket.emit(
        "sendMessage",
        { sender, receiver, message, roomId },
        (callback) => {
          sendMessageSuccess = callback.success;
          roomId = callback.roomId;
          if (!sendMessageSuccess) {
            axios
              .post("/api/config/pendingMessage", {
                receiverId: receiver,
                roomId: roomId,
              })
              .then((res) => {
                // console.log("res.data", res.data);
                if (res.data.success) {
                  // console.log("pending message update success");
                } else {
                  // console.log("pending message update failed");
                }
              });
          }
        }
      );

      // socket.emit("sendMessage", { sender, receiver, message }, (callback) => {
      //   console.log("callback: ", callback);
      // });

      let newMessageList = this.state.messageList;
      newMessageList[index].messages = [
        [this.state.userID, newMessage, new Date().getTime()],
        ...newMessageList[index].messages,
      ];

      let newRenderedMessages = this.renderMessages(
        newMessageList[index].messages
      );
      selected[2] = newRenderedMessages;

      this.setState({ selectedInfo: selected, messageList: newMessageList });

      //then update backend
      axios
        .post("/api/config/message", {
          sender: this.state.userID,
          receiver: receiverId,
          message: newMessage,
        })
        .then((res) => {
          if (res.data.success) {
            // console.log("message sent");
          }
        });
      return true;
    }
  };

  getPendNum = (chatterId) => {
    //edge case
    if (this.state.pendingList.length == 0) {
      return 0;
    }
    //find the room number
    let index = this.state.chatters.findIndex(
      (chatter) => chatter[1] == chatterId
    );
    let roomId = this.state.chatters[index][2];

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );
    if (numIndex != -1) {
      let num = this.state.pendingList[numIndex][1];
      if (num == 0) {
        // console.log("pending num is 0");
        return 0;
      }
      return num;
    }
    //don't have any pending message
    // console.log("don't have any pending message");
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

    let roomId = this.state.chatters[index][2];

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );
    if (numIndex != -1) {
      // update state in app.js ,update local, update backend
      let newPendingList = this.state.pendingList;
      let preNum = newPendingList[numIndex][1];
      this.props.reducePendingSum(preNum);

      newPendingList[numIndex][1] = 0;
      this.setState({ pendingList: newPendingList });
      axios
        .post("/api/config/processingMessage", {
          receiverId: this.state.userID,
          roomId: roomId,
        })
        .then((res) => {
          // console.log("processing message res.data:", res.data);
          if (res.data.success) {
            // console.log("procesising message backend success");
          } else {
            // console.log("procesising message backend failed");
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
    let roomId = this.state.chatters[index][2];

    //find number in pendingList
    let numIndex = this.state.pendingList.findIndex(
      (pending) => pending[0] == roomId
    );

    let newPendingList = this.state.pendingList;

    if (numIndex != -1) {
      // update local, update backend
      newPendingList[numIndex][1] += 1;
    } else {
      newPendingList.push([roomId, 1]);
    }
    this.setState({ pendingList: newPendingList });
    axios
      .post("/api/config/pendingMessage", {
        receiverId: this.state.userID,
        roomId: roomId,
      })
      .then((res) => {
        // console.log("addOnePend res.data:", res.data);
        if (res.data.success) {
          // console.log("addOnePend  backend success");
        } else {
          // console.log("addOnePend backend failed");
        }
      });
  };

  render() {
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
          // messageList={this.state.messageList}
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
