import React, { Component } from "react";

import InfiniteScroll from 'react-infinite-scroll-component';

import kun from "./kun.png";
import PostItem from "../post-item/post-item";
import "./container.css";

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

      if (i%4 == 0) {
        posts.push(
          <div key={i} className="post">
            <PostItem imageUrl="https://images.unsplash.com/photo-1501529301789-b48c1975542a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" profileUrl={kun} />
          </div>
        );
      } else if (i%3 == 0) {
        posts.push(
          <div key={i} className="post">
            <PostItem imageUrl="https://images.unsplash.com/photo-1542977466-bbacf83cb0b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80" profileUrl={kun} />
          </div>
        );
      } else if (i%2 == 0) {
        posts.push(
          <div key={i} className="post">
            <PostItem imageUrl="https://images.unsplash.com/photo-1541832039-cab7e4310f28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" profileUrl={kun} />
          </div>
        );
      } else {
        posts.push(
          <div key={i} className="post">
            <PostItem imageUrl="https://images.unsplash.com/photo-1503924087716-07cbd5f49b21?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80" profileUrl={kun} />
          </div>
        );
      }
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
