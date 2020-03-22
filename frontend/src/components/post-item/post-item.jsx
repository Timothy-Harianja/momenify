import React from "react";

import "./post-item.css";
import Button from "react-bootstrap/Button";
import CustomButton from "../custom-button/custom-button.component";

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
  constructor (props) {
    super(props)
    this.state ={
      commentInputBox: false
    }
  }

  showCommentInputBox = () => {
      this.setState({commentInputBox: !this.state.commentInputBox})
  }

  render () 
  { 
    return (
          <div className="post-item-container">
            <div className="post-item-header">
              <img className="post-item-header-profile" src={this.props.profileUrl} />
              <span className="post-item-header-name">{this.props.username}</span>
              <span className="post-item-header-buttons">
                <CustomButton color="base">Follow</CustomButton>
                <CustomButton color="base">Message</CustomButton>
                <CustomButton color="red">Report</CustomButton>    
              </span>
            </div>
            <div className="post-item-description">{this.props.text}</div>
        
            <img className="post-item-main-image" src={this.props.imageUrl} alt="post" />
            <div className="post-item-footer">
              <div className="post-item-footer-stats">
                <span className="post-item-footer-number-like">Number of likes: {this.props.numofLike}512</span>
                {/* <div>{likeStatus ? "" : "you already liked"}</div> */}
                <span className="post-item-footer-number-comment">Number of comments: 5</span>
              </div>
              <div className="post-item-footer-buttons">
                <Button
                  
                  className="post-item-footer-like-button"
                  variant="primary"
                >
                  Like
                </Button>
        
                <Button 
                  /* onClick={() => this.props.giveLike({ postid, position })} */
                  className="post-item-footer-comment-button" 
                  variant="primary"
                  onClick={this.showCommentInputBox}
                >
                  Comment
                </Button>
              </div> 
              <div className="post-item-footer-comment">{this.props.message}123123213</div>
              {
                  this.state.commentInputBox ?
                  (
                    <div className="post-item-footer-comment-box">
                      <form>
                        <input className ="comment-box" type="text" id="commentInputBox" required></input>
                        <input className ="comment-post" type="submit" value="POST"></input>
                      </form>
                    </div>

                  )
                  :
                  ""
                }
            </div>
          </div>
        );
  }

}





export default PostItem;