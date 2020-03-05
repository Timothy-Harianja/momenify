import React, { Component } from "react";
import "./create-post.css";

class CreatePost extends Component {
  render() {
    return (
      <div className="create-post">
        <form>
          <input
            type="text"
            id="message"
            value="What is on your mind now?"
          ></input>
          <div className="buttons">
            <button type="tag" id="tag">
              Hash Tag
            </button>
            <button type="upload" id="upload">
              Upload Image
            </button>
            <button type="post" id="post">
              Post
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
