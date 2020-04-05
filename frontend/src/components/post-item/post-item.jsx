import React from "react";
import "./post-item.css";
import Button from "react-bootstrap/Button";
import PostDropdown2 from "../post-dropdown/post-dropdown2";

// const PostItem = ({
//   imageUrl,
//   profileUrl,
//   text,
//   username,
//   postid,
//   giveLike,
//   likeStatus,
//   numofLike,
//   position,
//   message
// }) => (
//   <div className="post-item-container">
//     <div className="post-item-header">
//       <img className="post-item-header-profile" src={profileUrl} />
//       <span className="post-item-header-name">{username}</span>
//       <span className="post-item-header-buttons">
//         <CustomButton color="base">Follow</CustomButton>
//         <CustomButton color="base">Message</CustomButton>
//         <CustomButton color="red">Report</CustomButton>
//       </span>
//     </div>
//     <div className="post-item-description">{text}</div>

//     <img className="post-item-main-image" src={imageUrl} alt="post" />
//     <div className="post-item-footer">
//       <div className="post-item-footer-stats">
//         <span className="post-item-footer-number-like">Number of likes: {numofLike}512</span>
//         {/* <div>{likeStatus ? "" : "you already liked"}</div> */}
//         <span className="post-item-footer-number-comment">Number of comments: 5</span>
//       </div>
//       <div className="post-item-footer-buttons">
//         <Button
//           onClick={() => giveLike({ postid, position })}
//           className="post-item-footer-like"
//           variant="primary"
//         >
//           Like
//         </Button>

//         <Button
//           className="post-item-footer-comment"
//           onClick={}
//           variant="primary"
//         >
//           Comment
//         </Button>
//         <div>{message}123123213</div>
//       </div>
//     </div>
//   </div>
// );

// export default PostItem;

class PostItem extends React.Component {
  constructor(props) {
    super(props);
    // console.log("props: ", props);
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
    if (props.message.length < 3) {
      return (
        <div>
          <div>
            {props.message.map((message, index) =>
              index < 3 ? <div>{message}</div> : ""
            )}
          </div>
        </div>
      );
    } else if (props.message.length > 3) {
      return (
        <div>
          <div>
            {props.message.map((message, index) =>
              index < this.state.commentNumber ? <div>{message}</div> : ""
            )}
          </div>
          <div
            className="show-more-footer-comment"
            onClick={this.showMoreComment}
          >
            View more comment
          </div>
        </div>
      );
    } else {
    }
  };

  showMoreComment = () => {
    // I think i need access to the state
    this.setState({ commentNumber: this.state.commentNumber + 3 });
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
    // console.log("current position", this.state.position);
    return (
      <div className="post-item-container">
        <div className="post-item-header">
          <img
            className="post-item-header-profile"
            src={this.props.profileUrl}
          />
          <span className="post-item-header-name">{this.props.username}</span>
          <span className="post-item-header-buttons">
            <PostDropdown2></PostDropdown2>
          </span>
        </div>
        <div className="post-item-description">{this.props.text}</div>
        <img
          className="post-item-main-image"
          src={this.props.imageUrl}
          alt="post"
        />
        <div className="post-item-footer">
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
              message={this.props.message}
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
