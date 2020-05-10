import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Message from "../Message";
import moment from "moment";
import { Button } from "reactstrap";

import "./MessageList.css";

const MY_USER_ID = "apple";

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:3000/message";
  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    var tempMessages = [
      {
        id: 10,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 10,
        author: "apple",
        message: "Hello world!",
        timestamp: new Date().getTime(),
      },
    ];
    setMessages([...messages, ...tempMessages]);
  };

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

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

    return tempMessages;
  };

  const sendMessage = () => {
    console.log("true");
    return true;
  };
  return (
    <div className="message-list">
      <div className="message-list-container">{renderMessages()}</div>

      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Enter Your Message"
        />
        <Button
          variant="secondary"
          className="centerButton"
          onClick={() => sendMessage()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
