import React, { Component } from "react";
import axios from "axios";
import kun from "./kun.png";
import InfiniteScroll from "react-infinite-scroll-component";
import "./container.css";

class TopRightContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showFollowers = () => {
    // get all the posts from the
    var followers = [];
    for (var i = 0; i < this.props.follow.length; i++) {
      let currentFollow = this.props.follow[i];
      let uniqueID = currentFollow[0];
      let followName = currentFollow[1];
      let followLogo = currentFollow[2];
      followers.push(
        <a href={"/profile/" + uniqueID}>
          <div key={i} className="follower">
            <img src={followLogo} alt="kun" className="trend-img" />
            <span>{followName}</span>
          </div>
        </a>
      );
    }
    return followers;
  };

  render() {
    return (
      <div className="top-right-container">
        {this.props.userID ? (
          <InfiniteScroll
            dataLength={this.props.follow.length}
            next={this.loadMoreFollowers}
            // hasMore={true}
            height={200}
            // loader={<span>Loading more followers...</span>}
          >
            {this.showFollowers()}
          </InfiniteScroll>
        ) : (
          <div>
            <p>
              Please sign in first to see you follower, following, and
              notification.
            </p>

            <a href="/login">Login</a>
            <br></br>
            <a href="/signup">Sign Up</a>
          </div>
        )}
      </div>
    );
  }
}

export default TopRightContainer;
