import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import kun from "./kun.png";
import anonymous from "./anonymous.png";
import PostItem from "../post-item/post-item";
import "./container.css";

class PostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: 3,
      moments: [],
      usernameList: [],
      loadingFeedback: "Loading More..."
    };
  }

  componentDidMount() {
    axios.get("/api/getRoute/getMoment").then(res => {
      this.setState({
        moments: res.data.allMoments,
        usernameList: res.data.allUsername
      });
    });
  }
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
              this.state.usernameList[i] == undefined ? anonymous : kun
            }
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
