import React from "react";
import moment from "moment";
import "./Message.css";

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    myLogo,
  } = props;

  const friendlyTimestamp = moment(data.timestamp).format("LLLL");
  return (
    <div
      className={[
        "message",
        `${isMine ? "mine" : ""}`,
        `${startsSequence ? "start" : ""}`,
        `${endsSequence ? "end" : ""}`,
      ].join(" ")}
    >
      {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}

      <div className="bubble-container">
        <div>{isMine ? "" : <img class="yourlogo" src={myLogo} />}</div>
        <div className="bubble" title={friendlyTimestamp}>
          {data.message}
        </div>
        <div>{isMine ? <img class="mylogo" src={myLogo} /> : ""}</div>
      </div>
    </div>
  );
}
