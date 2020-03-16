import React from "react";

import "./post-item.css";
import Button from "react-bootstrap/Button";

const PostItem = ({
  imageUrl,
  profileUrl,
  text,
  username,
  postid,
  giveLike,
  likeStatus,
  numofLike,
  position,
  message
}) => (
  <div className="post-item-container">
    <div className="post-item-header">
      <img className="post-item-profile" src={profileUrl} />
      <span className="post-item-name">{username}</span>
    </div>
    <span>{text}</span>

    <img className="post-item-main-image" src={imageUrl} alt="post" />
    <div className="post-item-footer">
      <Button
        onClick={() => giveLike({ postid, position })}
        className="post-item-like"
        variant="primary"
      >
        Like
      </Button>

      <Button className="post-item-comment" variant="primary">
        Comment
      </Button>
      <div>{message}</div>
      {/* <div>{likeStatus ? "" : "you already liked"}</div> */}
      <div>{numofLike}</div>
    </div>
  </div>
);

export default PostItem;
