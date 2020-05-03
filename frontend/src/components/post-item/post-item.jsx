import React from "react";
import "./post-item.css";
import Button from "react-bootstrap/Button";
import PostDropdown from "../post-dropdown/post-dropdown";
import ProfileDropDown from "../post-dropdown/profile-dropdown";
class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.commentInput = React.createRef();
    this.state = {
      commentInputBox: false,
      commentNumber: 3,
      commentText: null,
      // showingPost: "",
      // postText1: "",
      // postText2: "",
      readMore: "Read all",
      splitPosition: 300,
      restText: false,
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
            View rest {this.props.comment.length - this.state.commentNumber}
            &nbsp;comments
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

  CheckMediaType = (file) => {
    let imageType = ["png", "jpg", "gif", "jpeg"];
    let videoType = ["mp4", "mov", "ogg"];
    const fileType = file.substring(file.length - 3, file.length).toLowerCase();
    const fileTypeCornerCase = file
      .substring(file.length - 4, file.length)
      .toLowerCase();

    if (
      imageType.includes(fileType) ||
      imageType.includes(fileTypeCornerCase)
    ) {
      return <img className="post-item-main-image" src={file} alt="" />;
    }
    if (videoType.includes(fileType)) {
      return (
        <video
          className="post-item-main-image"
          playsInline
          // src={file}
          controls
          loop
          preload="metadata"
          src={file + "#t=0.1"}
        ></video>
      );
    }
    return "unkown";
  };
  formatPostText = (text) => {
    var rowLen = text.replace(/ /g, "\u00a0").split("\n").length;

    return text
      .replace(/ /g, "\u00a0")
      .split("\n")
      .map((message, i) => {
        if (rowLen === i + 1) {
          //the last one: no <br/>
          return <span>{message}</span>;
        }

        return (
          <span>
            {message} <br />
          </span>
        );
      });
  };

  longPostText = () => {
    var edgeLength = 300;
    var text = this.props.text;
    var textLength = text.length + (text.match(/\n/g) || []).length * 80; //text length plus number of "\n"*80
    return textLength > edgeLength;
  };

  PostText = () => {
    return this.longPostText() ? (
      <div>
        {this.formatPostText(
          this.props.text.slice(0, this.props.splitPosition)
        )}
        {this.props.boolHide
          ? null
          : this.formatPostText(
              this.props.text.slice(this.props.splitPosition)
            )}
        <div
          className="show-more-footer-comment"
          onClick={() => this.props.changeBoolReadAll(this.props.position)}
        >
          {this.props.boolHide ? <span> Read all</span> : <span> Hide </span>}
        </div>
      </div>
    ) : (
      <div> {this.formatPostText(this.props.text)}</div>
    );
  };

  render() {
    return (
      <div className="post-item-container">
        <div className="post-item-header">
          {this.props.id == null ? (
            <img
              className="post-item-header-profile"
              src={this.props.profileUrl}
            />
          ) : (
            <a href={"/profile/" + this.props.uniqueID}>
              <img
                className="post-item-header-profile"
                src={this.props.profileUrl}
              />
            </a>
          )}

          {this.props.id == null ? (
            <span className="post-item-header-name">{this.props.username}</span>
          ) : (
            <a
              href={"/profile/" + this.props.uniqueID}
              className="post-item-header-name"
            >
              {this.props.username}
            </a>
          )}
          {this.props.followStatus ? (
            <span className="post-item-follow">-Followed</span>
          ) : (
            <span> </span>
          )}
          <span className="post-item-header-dropdown">
            {this.props.own ? (
              <ProfileDropDown
                deletePost={() => this.props.deletePost()}
                deleteID={(e) => this.props.deleteID(e)}
                postid={this.props.postid}
                position={this.props.position}
              ></ProfileDropDown>
            ) : (
              <PostDropdown
                // changeFollowStatus={(e) => this.changeFollowStatus(e)}
                postid={this.props.postid}
                followStatus={this.props.followStatus}
                updateFollow={(e) => this.props.updateFollow(e)}
                id={this.props.id}
                userId={this.props.userId}
                owned={this.props.owned}
                reportPost={(e) => this.props.reportPost(e)}
                reportID={(e) => this.props.reportID(e)}
              ></PostDropdown>
            )}
          </span>
          <span className="post-item-header-date">{this.props.postDate}</span>
        </div>
        <div className="post-item-description">
          <this.PostText></this.PostText>
        </div>

        {this.props.file != null ? (
          this.CheckMediaType(this.props.file)
        ) : (
          <span></span>
        )}

        <div className="post-item-footer">
          <span className="post-item-footer-stats">
            {this.props.hashtags.map((message) => (
              <a href={"/hashtag/" + message.substring(1)}>{message} &nbsp;</a>
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
                    postid: this.props.postid,
                    position: this.props.position,
                    postComment: this.state.commentText,
                  });
                  this.state.commentText = null;
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
