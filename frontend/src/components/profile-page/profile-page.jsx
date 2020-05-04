import React, { Component } from "react";
import PostsContainer from "../posts-container/posts-container";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import anonymous from "../posts-container/anonymous.png";
import axios from "axios";
import PostItem from "../post-item/post-item";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";
import logo3 from "../images/logo3.png";
import logo4 from "../images/logo4.png";
import logo5 from "../images/logo5.png";
import logo6 from "../images/logo6.png";
import logo7 from "../images/logo7.png";
import logo8 from "../images/logo1.png";
import logo9 from "../images/logo9.png";
import one from "../images/one.png";
import two from "../images/two.png";
import three from "../images/three.png";
import four from "../images/four.png";
import five from "../images/five.png";
import "./profile-page.css";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      posts: 0,
      ProfileUserId: null,
      moments: [],
      usernameList: null,
      postidList: [],
      loadingFeedback: "",
      likeStatus: [],
      numofLike: [],
      message: [],
      userLogo: null,
      commentList: [],
      postDateList: [],
      hashtagList: [],
      topTrendList: [],
      loadStatus: false,
      filesList: [],
      visibleList: [],
      uniqueID: null,
      owner: null,
      deleteID: null,
      position: null,
      following: [],
      followStatus: false,
      boolHideList: [],
      testBool: false,
      own: false,
    };
  }

  componentDidMount() {
    axios
      .get("/api/loginRoute/session")
      .then((res) => {
        this.setState({
          userId: res.data.userId,
          logoNumber: res.data.logoNumber,
          owner: res.data.uniqueID,
          following: res.data.following,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        axios
          .get("/api/getRoute/profilePage")
          .then((res) => {
            this.setState({
              loadingFeedback:
                res.data.allMoments.length > 3 ? "Loading Posts..." : "",
              posts:
                res.data.allMoments.length >= 3
                  ? 3
                  : res.data.allMoments.length,
              ProfileUserId: res.data.ProfileUserId,
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
              visibleList: res.data.visibleList,
              loadStatus: true,
              filesList: res.data.filesList,
              uniqueID: res.data.uniqueID,
              own: res.data.uniqueID == this.state.owner,
              followStatus:
                this.state.following === undefined
                  ? false
                  : this.state.following.includes(res.data.ProfileUserId)
                  ? true
                  : false,
            });
            for (let i = 0; i < res.data.allMoments.length; i++) {
              this.state.boolHideList.push(true);
            }
            this.setState({ testBool: true });
          })
          .catch((err) => {
            console.log(err);
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

    if (this.state.loadStatus) {
      for (let i = 0; i < this.state.posts; i++) {
        posts.push(
          <div key={i} className="post">
            <PostItem
              username={
                this.state.usernameList == undefined
                  ? " Anonymous"
                  : this.state.usernameList
              }
              id={this.state.ProfileUserId}
              uniqueID={this.state.uniqueID}
              postDate={this.state.postDateList[i]}
              text={this.state.moments[i]}
              likeStatus={this.state.message[i]}
              imageUrl="https://images.unsplash.com/photo-1501529301789-b48c1975542a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
              profileUrl={
                this.state.usernameList == undefined
                  ? "https://momenify.s3.us-east-2.amazonaws.com/default.png"
                  : this.state.userLogo
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
              visible={this.state.visibleList[i]}
              file={this.state.filesList[i]}
              own={this.state.own}
              deletePost={() => this.deletePost()}
              deleteID={(e) => this.deleteID(e)}
              followStatus={this.state.followStatus}
              updateFollow={(e) => this.updateFollow(e)}
              splitPosition={this.getSplitPosition(this.state.moments[i])}
              boolHide={this.state.boolHideList[i]}
              changeBoolReadAll={(position) => this.changeBoolReadAll(position)}
              changeVisible={(e) => this.changeVisible(e)}
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

  changeVisible = (e) => {
    axios
      .post("/api/config/changeVisible", {
        postid: e.changeID,
        visible: !this.state.visibleList[e.position],
      })
      .then((res) => {
        if (res.data.success) {
          let newVisibleList = this.state.visibleList;
          newVisibleList[e.position] = !newVisibleList[e.position];
          this.setState({ visibleList: newVisibleList });
        } else {
          alert("something went wrong!");
        }
      });
  };
  deletePost = () => {
    axios
      .post("/api/config/deletePost", {
        deleteID: this.state.deleteID,
        hashtags: this.state.hashtagList[this.state.position],
        key: this.state.filesList[this.state.position],
      })
      .then((res) => {
        if (res.data.success) {
          this.componentDidMount();
        }
      });
  };

  deleteID = (req) => {
    this.setState({ deleteID: req.deleteID, position: req.position });
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
    this.setState({ followStatus: !this.state.followStatus });
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
      <div className="profile-body">
        <div className="profile-home-page">
          <div className="profile-main-posts-container">
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

export default ProfilePage;
