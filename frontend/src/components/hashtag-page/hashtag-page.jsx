import React, { Component } from "react";
import PostsContainer from "../posts-container/posts-container";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import axios from "axios";
import PostItem from "../post-item/post-item";

import "./hashtag-page.css";

class HashtagPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      posts: 0,
      hashtagName: null,
      idList: [],
      moments: [],
      usernameList: [],
      postidList: [],
      loadingFeedback: "",
      likeStatus: [],
      numofLike: [],
      message: [],
      userLogo: [],
      uniqueIDList: [],
      commentList: [],
      postDateList: [],
      hashtagList: [],
      topTrendList: [],
      loadStatus: false,
      filesList: [],
      following: [],
      followStatus: [],
      boolHideList: [],
      testBool: false,
      uniqueID: null,
    };
  }

  componentDidMount() {
    axios
      .get("/api/loginRoute/session")
      .then((res) => {
        this.setState({
          userId: res.data.userId,
          logoNumber: res.data.logoNumber,
          following: res.data.following,
          uniqueID: res.data.uniqueID,
        });
      })
      .then(() => {
        axios.get("/api/getRoute/hashtagPage").then((res) => {
          this.setState({
            loadingFeedback:
              res.data.allMoments.length > 3 ? "Loading Posts..." : "",
            posts:
              res.data.allMoments.length >= 3 ? 3 : res.data.allMoments.length,
            idList: res.data.idList,
            moments: res.data.allMoments,
            usernameList: res.data.allUsername,
            postidList: res.data.allPostid,
            likeStatus: Array(res.data.momentLength).fill(false),
            numofLike: res.data.numofLike,
            message: Array(res.data.momentLength).fill(""),
            userLogo: res.data.logoList,
            commentList: res.data.commentList,
            postDateList: res.data.postDateList,
            hashtagList: res.data.hashtagList,
            hashtagName: res.data.hashtagName,
            loadStatus: true,
            filesList: res.data.filesList,
            uniqueIDList: res.data.uniqueIDList,
          });
          for (let i = 0; i < res.data.allMoments.length; i++) {
            this.state.followStatus.push(
              this.state.following === undefined
                ? false
                : this.state.following.includes(res.data.idList[i])
                ? true
                : false
            );
            this.state.boolHideList.push(true);
            this.setState({ testBool: true });
          }
        });
      });
  }

  giveComment = (comment) => {
    if (comment.postComment != null && comment.postComment.trim() != "") {
      axios
        .post("/api/postRoute/postComment", comment)
        .then((res) => {
          if (res.data.success == false) {
            alert("Please login to make a comment!");
          } else {
            let newCommentList = this.state.commentList;
            newCommentList[comment.position].push(res.data.message);
            this.setState({ commentList: newCommentList });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Comment cannot be empty!");
    }
  };

  giveLike = (post) => {
    let postId = post.postid;
    axios
      .post("/api/postRoute/giveLike", { postId: postId })
      .then((res) => {
        if (res.data.success) {
          let newlikeStatus = this.state.likeStatus;
          newlikeStatus[post.position] = true;
          let newnumofLike = this.state.numofLike;
          newnumofLike[post.position] += 1;
          this.setState({ likeStatus: newlikeStatus });
          this.setState({ numofLike: newnumofLike });
        } else {
          this.setState({ likeMessage: res.data.message });
          if (res.data.message == "you already liked this post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "you already liked this post";
            alert("you already liked this post");
            this.setState({ message: newMessage });
          }
          if (res.data.message == "please login to like a post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "please login to like a post";
            alert("please login to like a post");
            this.setState({ message: newMessage });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showPosts = () => {
    // get all the posts from the
    var posts = [];
    // console.log("this happens last, ", this.state.testBool);

    if (this.state.loadStatus) {
      for (let i = 0; i < this.state.posts; i++) {
        console.log("own: ", this.state.uniqueID == this.state.uniqueIDList[i]);
        posts.push(
          <div key={i} className="post">
            <PostItem
              username={
                this.state.usernameList[i] == undefined
                  ? "Anonymous"
                  : this.state.usernameList[i]
              }
              id={this.state.idList[i]}
              postDate={this.state.postDateList[i]}
              text={this.state.moments[i]}
              likeStatus={this.state.message[i]}
              imageUrl="https://images.unsplash.com/photo-1501529301789-b48c1975542a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
              profileUrl={
                this.state.usernameList[i] == undefined
                  ? "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                  : this.state.userLogo[i]
              }
              postid={this.state.postidList[i]}
              position={i}
              commentsCount={this.state.commentList[i].length}
              giveLike={(e) => this.giveLike(e)}
              giveComment={(e) => this.giveComment(e)}
              likeStatus={this.state.likeStatus[i]}
              numofLike={this.state.numofLike[i]}
              hashtags={this.state.hashtagList[i]}
              comment={this.state.commentList[i]}
              file={this.state.filesList[i]}
              uniqueID={this.state.uniqueIDList[i]}
              followStatus={this.state.followStatus[i]}
              updateFollow={(e) => this.updateFollow(e)}
              splitPosition={this.getSplitPosition(this.state.moments[i])}
              boolHide={this.state.boolHideList[i]}
              changeBoolReadAll={(position) => this.changeBoolReadAll(position)}
              owned={this.state.uniqueID == this.state.uniqueIDList[i]}
              reportPost={(e) => this.reportPost(e)}
              reportID={(e) => this.reportID(e)}
            />
          </div>
        );
      }
    }
    return posts;
  };

  reportID = (e) => {
    this.setState({ reportID: e.id });
  };

  reportPost = (req) => {
    axios.post("/api/config/reportPost", {
      message: req.message,
      reportID: this.state.reportID,
    });
  };

  loadMorePosts = () => {
    let leftPost = this.state.moments.length - this.state.posts;
    let newPost = 0;
    if (leftPost > 0) {
      newPost = leftPost >= 3 ? 3 : leftPost;
      setTimeout(() => {
        this.setState({ posts: this.state.posts + newPost });
      }, 200);
    } else {
      this.setState({
        loadingFeedback: "",
      });
    }
  };

  updateFollow = (req) => {
    var idList = this.state.idList;
    var followStatus = this.state.followStatus;
    for (let i = 0; i < idList.length; i++) {
      if (idList[i] == req.id) {
        followStatus[i] = !followStatus[i];
      }
    }
    this.setState({ followStatus: followStatus });
    //update following list
    if (req.action == "follow") {
      this.state.following.push(req.id);
    } else {
      this.state.following.filter((item) => item != req.id);
    }
  };
  getSplitPosition = (text) => {
    var edgeLength = 300;
    var textLength = text.length + (text.match(/\n/g) || []).length * 80; //text length plus number of "\n"*80

    if (textLength <= edgeLength) {
      return 0;
    }
    var retVal = 300;
    var shortText = text.slice(0, 300);
    if ((shortText.match(/\n/g) || []).length >= 4) {
      //find the position of the 4th happened \n
      var spl = shortText.split("\n");
      retVal =
        spl[0].length + spl[1].length + spl[2].length + spl[3].length + 3;
      // retVal = shortText.indexOf("\n", shortText.indexOf("\n") + 4) - 1;
    }
    return retVal;
  };

  changeBoolReadAll = (position) => {
    var newBoolHideList = this.state.boolHideList;
    newBoolHideList[position] = !newBoolHideList[position];
    this.setState({ boolHideList: newBoolHideList });
  };
  render() {
    return (
      <div className="hashtag-body">
        <br></br>
        <div className="tagName">
          <h2>{this.state.hashtagName}</h2>

          <h3>{this.state.moments.length} &nbsp;moments</h3>
        </div>
        <div className="hashtag-home-page">
          <div className="hashtag-main-posts-container">
            <PostsContainer
              postContent={this.state.postContent}
              resetPostContent={() => this.resetNewPost()}
              loadMorePosts={() => this.loadMorePosts()}
              showPosts={() => this.showPosts()}
              giveLike={(post) => this.giveLike(post)}
              state={this.state}
            />
          </div>
        </div>
        <ScrollUpButton />
      </div>
    );
  }
}

export default HashtagPage;
