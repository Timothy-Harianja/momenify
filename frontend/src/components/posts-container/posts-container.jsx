import React, { Component } from "react";

import InfiniteScroll from 'react-infinite-scroll-component';

import PostItem from "../post-item/post-item";
import "./posts-container.css";

class PostsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: 3
    };
  }

  componentDidMount() {
  }



  showPosts = () => {
    // get all the posts from the
    var posts = [];
    for (var i = 0; i < this.state.posts; i++) {
      posts.push(
        <div key={i} className="post">
          <PostItem imageUrl="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
        </div>
      );
    }
    return posts;
  }

  loadMorePosts = () => {
    setTimeout(() => {
      this.setState({ posts: this.state.posts + 2});
    }, 2000);
  }

  render() {
    return (
      <div className="posts-container">
        <InfiniteScroll
          dataLength={this.state.posts}
          next={this.loadMorePosts}
          hasMore={true}
          loader={<h4>Loading more...</h4>}
        >
          {this.showPosts()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default PostsContainer;
