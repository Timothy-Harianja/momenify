import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Message from "../Message";
import moment from "moment";
import { Button } from "reactstrap";

import "./MessageList.css";
import { set } from "mongoose";

const MY_USER_ID = "apple";

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);
  const [renderedMessage, setRenderedMessage] = useState(["hello"]);
  const [typedMessage, setTypedMessage] = useState([""]);

  useEffect(() => {}, []);

  // console.log("message: ", typedMessage);

  return (
    <div className="message-list">
      <div className="message-list-container">{props.selectedInfo[2]}</div>

      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Enter Your Message"
          value={typedMessage}
          onChange={(e) => {
            setTypedMessage(e.target.value);
          }}
        />
        <Button
          variant="secondary"
          className="centerButton"
          onClick={() => {
            props.sendMessage({
              newMessage: typedMessage,
              sender: props.MY_USER_ID,
            });
            setTypedMessage("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
