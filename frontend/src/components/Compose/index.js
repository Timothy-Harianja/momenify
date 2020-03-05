import React from "react";
import "./Compose.css";
import { Button } from "reactstrap";

export default function Compose(props) {
  return (
    <div className="compose">
      <input
        type="text"
        className="compose-input"
        placeholder="Enter Your Message"
      />
      <Button variant="secondary" className="centerButton">
        Send
      </Button>
    </div>
  );
}
