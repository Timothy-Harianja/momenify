import React, { Component } from "react";
import "./create-post.css";
import pic from "./imageicon.png"
import hash from "./hashtag.jpeg"
import posticon from"./posticon.png"
class CreatePost extends Component {
  render() {
    return (
      <div className="create-post">
        <form>
          <textarea id="message" placeholder="You can say something here.">
          </textarea>
          <div className="buttons">
            <button type="tag" className="btn btn-light" id="tag">
            <img src={hash} alt="pic" id="pic" />
              Hashtag
            </button>
            <button type="upload" className="btn btn-light" id="upload">
            <img src={pic} alt="pic" id="pic" />
              Photo
            </button>
            <button type="post" className="btn btn-light" id="post">
            <img src={posticon} alt="pic" id="pic" />
              Post
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
