import React from "react";
import "./post-item.css";
import Button from "react-bootstrap/Button";
import PostDropdown from "../post-dropdown/post-dropdown";

class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.commentInput = React.createRef();
    this.state = {
      commentInputBox: false,
      commentNumber: 3,
      commentText: null,
      postid: this.props.postid,
      position: this.props.position,
    };
  }

  CommentSection = (props) => {
    return (
      <div>
        {props.message.map((message, index) =>
          index < this.state.commentNumber ? <div>{message}</div> : ""
        )}
        {props.message.length > 3 &&
        this.state.commentNumber < props.message.length ? (
          <div
            className="show-more-footer-comment"
            onClick={this.showMoreComment}
          >
            View rest comments
          </div>
        ) : null}
      </div>
    );
  };

  showMoreComment = () => {
    let restComment = this.props.comment.length - this.state.commentNumber;
    this.setState({ commentNumber: this.state.commentNumber + restComment });
  };

  showCommentInputBox = () => {
    this.setState({ commentInputBox: !this.state.commentInputBox });
  };

  focusCommentInput = () => {
    this.commentInput.current.focus();
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="post-item-container">
        <div className="post-item-header">
          <img
            className="post-item-header-profile"
            src={this.props.profileUrl}
          />
          <span className="post-item-header-name">{this.props.username}</span>
          <span className="post-item-header-dropdown">
            <PostDropdown></PostDropdown>
          </span>
          <span className="post-item-header-date">{this.props.postDate}</span>
        </div>
        <div className="post-item-description">{this.props.text}</div>
        {/* <img
          className="post-item-main-image"
          src={this.props.imageUrl}
          alt="post"
        /> */}

        <div className="post-item-footer">
          <span className="post-item-footer-stats">
            {this.props.hashtags.map((message) => (
              <a href={"/hashtag?hashtag=" + message}>{"#" + message}</a>
            ))}
          </span>
          <div className="post-item-footer-stats">
            <span className="post-item-footer-number-like">
              Number of likes: {this.props.numofLike}
            </span>
            {/* <div>{likeStatus ? "" : "you already liked"}</div> */}
            <span className="post-item-footer-number-comment">
              Number of comments: {this.props.commentsCount}
            </span>
          </div>

          <div className="post-item-footer-buttons">
            <Button
              className="post-item-footer-like-button"
              variant="primary"
              onClick={() =>
                this.props.giveLike({
                  postid: this.props.postid,
                  position: this.props.position,
                })
              }
            >
              Like
            </Button>

            <Button
              /* onClick={() => this.props.giveLike({ postid, position })} */
              className="post-item-footer-comment-button"
              variant="primary"
              for="focus-post"
              onClick={this.focusCommentInput}
              /* onClick={this.showCommentInputBox} */
            >
              Comment
            </Button>
          </div>
          <div className="post-item-footer-comment">
            <this.CommentSection
              message={this.props.comment}
            ></this.CommentSection>
          </div>
          <div className="post-item-footer-comment-box">
            <form onSubmit={this.submitHandler} id="submitform">
              <input
                ref={this.commentInput}
                onChange={(e) => this.setState({ commentText: e.target.value })}
                className="comment-box"
                type="text"
                id="commentInputBox"
                required
              ></input>
              <input
                className="comment-post"
                type="reset"
                value="POST"
                onClick={() => {
                  this.setState({
                    commentNumber: this.state.commentNumber + 1,
                  });
                  this.props.giveComment({
                    postid: this.state.postid,
                    position: this.state.position,
                    postComment: this.state.commentText,
                  });
                }}
              ></input>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PostItem;
