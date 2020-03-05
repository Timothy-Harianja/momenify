import React from "react";
import MessageList from "../MessageList/index.js";
import ScrollBar from "../horScrollBar/scrollBar.jsx";
import "./Messenger.css";

export default function Messenger(props) {
  return (
    <div>
      {/* <div className="scrollable content"> */}
      <ScrollBar />
      <MessageList />
      {/* </div> */}
    </div>
  );
}
