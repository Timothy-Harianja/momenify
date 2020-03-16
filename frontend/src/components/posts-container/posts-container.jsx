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
      //       posts: 3,
      //       moments: [],
      //       usernameList: [],
      //       postidList: [],
      //       loadingFeedback: "Loading More...",
      //       likeStatus: [],
      //       numofLike: [],
      //       message: [],
      //       userLogo: []
    };
  }

  componentDidMount() {}
  giveLike = post => {
    this.props.giveLike(post);
  };

  showPosts = () => {
    return this.props.showPosts();
  };

  loadMorePosts = () => {
    this.props.loadMorePosts();
  };

  render() {
    return (
      <div className="posts-container">
        <InfiniteScroll
          dataLength={this.props.state.posts}
          next={this.loadMorePosts}
          hasMore={true}
          loader={<h4>{this.props.state.loadingFeedback}</h4>}
        >
          {this.showPosts()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default PostsContainer;
