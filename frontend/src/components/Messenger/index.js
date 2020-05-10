import React, { Component } from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";
import axios from "axios";
import io from "socket.io-client";

let socket;

// One item component
// selected prop will be passed
const MenuItem = ({ text, selected }) => {
  return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.map((el) => {
    console.log("el ", el);
    const { name } = el;

    return <MenuItem text={name} key={name} selected={selected} />;
  });

class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatters: [],
      messageList: [],
      userID: null,
      roomList: [],
      menuItems: [],
      selected: "",
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
          //default chat room when enter
          let convert = this.covertType([
            res.data.chatters,
            res.data.messageList,
          ]);
          // let list = res.data.chatters.map((x) => {
          //   let tail = x[0];
          //   return { name: tail };
          // });
          let chatterList = convert[0];
          let messageList = convert[1];
          let name = chatterList[0].name;
          this.setState({
            chatters: res.data.chatters,
            messageList: messageList,
            roomList: res.data.roomList,
            menuItems: Menu(chatterList, name),
            selected: name,
          });
          console.log("chatters:", this.state.chatters);
          console.log("messageList:", this.state.messageList);
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
    let chatter = input[0];
    console.log("chatter", chatter);
    let messages = input[1];
    console.log("messages", messages);
    let retChatter = chatter.map((x) => {
      let tail = x[0];
      return { name: tail };
    });

    let retMessages = messages.map((m) => {
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
    return [retChatter, retMessages];
  };
  //when click the scroll, show all messages with him
  scrollBarClick = () => {
    socket = io();
  };

  onSelectChatter = (key) => {
    console.log(key);
    this.setState({ selected: key });
  };
  render() {
    console.log("got here");
    return (
      <div>
        {/* <div className="scrollable content"> */}
        <ScrollBar
          chatters={this.state.chatters}
          // showChatters={() => this.showChatters()}
          menuItems={this.state.menuItems}
          selected={this.state.selected}
          onSelectChatter={(e) => this.onSelectChatter(e)}
        />
        <MessageList />
        {/* </div> */}
      </div>
    );
  }
}

export default Messenger;
