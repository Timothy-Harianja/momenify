import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import kun from "./kun.png";
import anonymous from "./anonymous.png";
import PostItem from "../post-item/post-item";
import "./container.css";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";
import logo3 from "../images/logo3.png";
import logo4 from "../images/logo4.png";
import logo5 from "../images/logo5.png";
import logo6 from "../images/logo6.png";
import logo7 from "../images/logo7.png";
import logo8 from "../images/logo1.png";
import logo9 from "../images/logo9.png";

class PostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: 3,
      moments: [],
      usernameList: [],
      postidList: [],
      loadingFeedback: "Loading More...",
      likeStatus: [],
      numofLike: [],
      message: [],
      userLogo: []
    };
  }

  componentDidMount() {
    axios.get("/api/getRoute/getMoment").then(res => {
      this.setState({
        moments: res.data.allMoments,
        usernameList: res.data.allUsername,
        postidList: res.data.allPostid,
        likeStatus: Array(res.data.momentLength).fill(false),
        numofLike: res.data.numofLike,
        message: Array(res.data.momentLength).fill(""),
        userLogo: res.data.logoList
      });
    });
  }
  giveLike = post => {
    // console.log(post.postid);
    let postId = post.postid;
    axios
      .post("/api/getRoute/giveLike", { postId: postId })
      .then(res => {
        // console.log(res);
        if (res.data.success) {
          let newlikeStatus = this.state.likeStatus;
          newlikeStatus[post.position] = true;
          let newnumofLike = this.state.numofLike;
          newnumofLike[post.position] += 1;
          this.setState({ likeStatus: newlikeStatus });
          this.setState({ numofLike: newnumofLike });
          console.log("success");
        } else {
          this.setState({ likeMessage: res.data.message });
          if (res.data.message == "you already liked this post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "you already liked this post";
            this.setState({ message: newMessage });
          }
          if (res.data.message == "please login to like a post") {
            let newMessage = this.state.message;
            newMessage[post.position] = "please login to like a post";
            this.setState({ message: newMessage });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    // console.log("entered posts: ", this.state.moments);
    // let newArray = ["haha", ...this.state.moments];
    // this.setState({ moments: newArray });
  };

  getLogo = num => {
    let list = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9];
    return list[parseInt(num) - 1];
  };

  showPosts = () => {
    // get all the posts from the
    var posts = [];

    // console.log("length of moment list: ", this.state.moments.length);
    for (let i = 0; i < this.state.posts; i++) {
      // console.log("i: " + i + " ", this.state.moments[i]);
      // console.log("i: " + i + " ", this.state.usernameList[i]);

      posts.push(
        <div key={i} className="post">
          <PostItem
            username={
              this.state.usernameList[i] == undefined
                ? " Anonymous"
                : this.state.usernameList[i]
            }
            text={this.state.moments[i]}
            imageUrl="https://images.unsplash.com/photo-1501529301789-b48c1975542a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
            profileUrl={
              this.state.usernameList[i] == undefined
                ? anonymous
                : this.getLogo(this.state.userLogo[i])
            }
            postid={this.state.postidList[i]}
            giveLike={e => this.giveLike(e)}
            likeStatus={this.state.likeStatus[i]}
            numofLike={this.state.numofLike[i]}
            position={i}
            message={this.state.message[i]}
          />
        </div>
      );
    }
    return posts;
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
      this.setState({ loadingFeedback: "You have reached the end..." });
    }
  };

  render() {
    // console.log("all posts:", this.state.moments);
    // console.log("current post: ", this.state.moments[2]);

    return (
      <div className="posts-container">
        <InfiniteScroll
          dataLength={this.state.posts}
          next={this.loadMorePosts}
          hasMore={true}
          loader={<h4>{this.state.loadingFeedback}</h4>}
        >
          {this.showPosts()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default PostsContainer;
