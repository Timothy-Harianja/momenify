import React, { Component } from "react";
import axios from "axios";
import kun from "./kun.png";
import InfiniteScroll from "react-infinite-scroll-component";
import "./container.css";

class TopRightContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: 5,
      loading: false,
      username: null
    };
  }

  componentDidMount() {
    axios.get("/api/loginRoute/session").then(res => {
      this.setState({ username: res.data.username });
    });
  }

  showFollowers = () => {
    // get all the posts from the
    var followers = [];
    for (var i = 0; i < this.state.followers; i++) {
      followers.push(
        <div key={i} className="follower">
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
        {this.state.username ? (
          <InfiniteScroll
            dataLength={this.state.followers}
            next={this.loadMoreFollowers}
            hasMore={true}
            height={200}
            loader={<span>Loading more followers...</span>}
          >
            {this.showFollowers()}
          </InfiniteScroll>
        ) : (
          <div>
            <p>Please sign in first to see you follower and following.</p>

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
