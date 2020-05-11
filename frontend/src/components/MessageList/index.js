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

  useEffect(() => {
    // renderMessages();
    console.log("did finish renderMessages");
    // getMessages();
  }, []);

  // const getMessages = () => {
  //   var tempMessages = [
  //     {
  //       id: 1,
  //       author: "apple",
  //       message:
  //         "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
  //       timestamp: new Date().getTime(),
  //     },
  //     {
  //       id: 2,
  //       author: "orange",
  //       message:
  //         "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
  //       timestamp: new Date().getTime(),
  //     },
  //     {
  //       id: 3,
  //       author: "orange",
  //       message:
  //         "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
  //       timestamp: new Date().getTime(),
  //     },
  //   ];
  //   setMessages([...messages, ...tempMessages]);
  // };

  // const renderMessages = () => {
  //   //check messageList undefined
  //   let messages = [];

  //   if (props.messageList != undefined && props.messageList.length != 0) {
  //     console.log("selectedInfo ", props.selectedInfo);

  //     console.log(" selectedInfo[2] ", props.selectedInfo[2]);
  //     messages = props.selectedInfo[2];
  //     console.log("messages length: ", messages.length);
  //   }
  //   let i = 0;
  //   let messageCount = messages.length;
  //   let tempMessages = [];

  //   while (i < messageCount) {
  //     let previous = messages[i - 1];
  //     let current = messages[i];
  //     let next = messages[i + 1];
  //     let isMine = current.author === props.MY_USER_ID;
  //     let currentMoment = moment(current.timestamp);
  //     let prevBySameAuthor = false;
  //     let nextBySameAuthor = false;
  //     let startsSequence = true;
  //     let endsSequence = true;
  //     let showTimestamp = true;

  //     if (previous) {
  //       let previousMoment = moment(previous.timestamp);
  //       let previousDuration = moment.duration(
  //         currentMoment.diff(previousMoment)
  //       );
  //       prevBySameAuthor = previous.author === current.author;

  //       if (prevBySameAuthor && previousDuration.as("hours") < 1) {
  //         startsSequence = false;
  //       }

  //       if (previousDuration.as("hours") < 1) {
  //         showTimestamp = false;
  //       }
  //     }

  //     if (next) {
  //       let nextMoment = moment(next.timestamp);
  //       let nextDuration = moment.duration(nextMoment.diff(currentMoment));
  //       nextBySameAuthor = next.author === current.author;

  //       if (nextBySameAuthor && nextDuration.as("hours") < 1) {
  //         endsSequence = false;
  //       }
  //     }

  //     tempMessages.push(
  //       <Message
  //         key={i}
  //         isMine={isMine}
  //         startsSequence={startsSequence}
  //         endsSequence={endsSequence}
  //         showTimestamp={showTimestamp}
  //         data={current}
  //       />
  //     );

  //     // Proceed to the next message.
  //     i += 1;
  //   }
  //   tempMessages = tempMessages.reverse();
  //   // setRenderedMessage(tempMessages);

  //   return tempMessages;
  // };
  const getMessages = () => {
    var tempMessages = [
      {
        id: 1,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 2,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 3,
        author: "orange",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 4,
        author: "apple",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 5,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 6,
        author: "apple",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 7,
        author: "orange",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 8,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
      {
        id: 9,
        author: "apple",
        message:
          "Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.",
        timestamp: new Date().getTime(),
      },
      {
        id: 10,
        author: "orange",
        message:
          "It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!",
        timestamp: new Date().getTime(),
      },
    ];
    setMessages([...messages, ...tempMessages]);
  };

  const renderMessages = () => {
    //check messageList undefined
    let messages = [];

    if (props.messageList != undefined && props.messageList.length != 0) {
      console.log("selectedInfo ", props.selectedInfo);

      console.log(" selectedInfo[2] ", props.selectedInfo[2]);
      messages = props.selectedInfo[2];
      console.log("messages length: ", messages.length);
    }
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === props.MY_USER_ID;
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
    tempMessages = tempMessages.reverse();

    return tempMessages;
  };

  const sendMessage = () => {
    console.log("true");
    return true;
  };

  console.log("happends then");

  return (
    <div className="message-list">
      <div className="message-list-container">{props.renderMessages()}</div>

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
