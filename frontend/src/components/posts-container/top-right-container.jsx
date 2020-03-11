import React, { Component } from "react";

import kun from "./kun.png";
import InfiniteScroll from "react-infinite-scroll-component";

import "./container.css";

class TopRightContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: 5,
      loading: false
    };
  }

  componentDidMount() {}

  showFollowers = () => {
    // get all the posts from the
    var followers = [];
    for (var i = 0; i < this.state.followers; i++) {
      followers.push(
        <div key={i} className="follower">
          {/* <PostItem imageUrl="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" /> */}
          <img src={kun} alt="kun" className="trend-img" />
          <span>Follower {i}</span>
        </div>
      );
    }
    return followers;
  };

  loadMoreFollowers = () => {
    setTimeout(() => {
      this.setState({ followers: this.state.followers + 5 });
    }, 2000);
  };

  render() {
    return (
      <div className="top-right-container">
        <InfiniteScroll
          dataLength={this.state.followers}
          next={this.loadMoreFollowers}
          hasMore={true}
          height={200}
          loader={<span>Loading more followers...</span>}
        >
          {this.showFollowers()}
        </InfiniteScroll>
      </div>
    );
  }
}

export default TopRightContainer;
