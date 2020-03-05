import React, { Component } from "react";

import PostItem from "../post-item/post-item";

import "./posts-container.css";

class TrendContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: 3,
      loading: false
    };
  }

  componentDidMount() {
    //Detect when scrolled to bottom
    this.refs.infiniteScroll.addEventListener("scroll", () => {
      if (
        this.refs.infiniteScroll.scrollTop +
          this.refs.infiniteScroll.clientHeight >=
        this.refs.infiniteScroll.scrollHeight
      ) {
        this.loadMorePosts();
      }
    });
  }

  showPosts() {
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

  loadMorePosts() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ posts: this.state.posts + 2, loading: false });
    }, 2000);
  }

  render() {
    return (
      <div className="trend-container" ref="infiniteScroll">
        {this.showPosts()}
        {this.state.loading ? (
          <p className="loading-text">loading more posts...</p>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default TrendContainer;
