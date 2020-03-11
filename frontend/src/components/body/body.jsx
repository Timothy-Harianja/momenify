import React, { Component } from "react";

import PostsContainer from "../posts-container/posts-container";

import "./body.css";
import TopRightContainer from "../posts-container/top-right-container";
import TrendContainer from "../posts-container/trend-container";
import kun from "./kun.png";
import CreatePost from "../create-post/create-post";

class Body extends Component {
  render() {
    return (
      <div className="body">
        <div className="create-post-container">
          <div className="create-post-div">
            <CreatePost />
          </div>
        </div>

        <div className="home-page">
          <div className="main-posts-container">
            <PostsContainer />
          </div>
          <div className="side-posts-container">
            <div className="wrapper">
              <div className="box top">
                <div>
                  <img src={kun} alt="kun" id="side-profile" />
                  <button id="follower">Followers</button>
                  <button id="following">Following</button>
                </div>
                <TopRightContainer />
              </div>
              <div className="box middle">
                <div id="trending-hashtag">Trending Hastags #</div>
                <span class="line-fade"></span>
                <div id="trend-list">
                  <ul>
                    <li>
                      <img src={kun} alt="kun" className="trend-img" />
                      <h3>#Trending Hashtag 1</h3>
                    </li>
                    <li>
                      <img src={kun} alt="kun" className="trend-img" />
                      <h3>#Trending Hashtag 2</h3>
                    </li>
                    <li>
                      <img src={kun} alt="kun" className="trend-img" />
                      <h3>#Trending Hashtag 3</h3>
                    </li>
                    <li>
                      <img src={kun} alt="kun" className="trend-img" />
                      <h3>#Trending Hashtag 4</h3>
                    </li>
                    <li>
                      <img src={kun} alt="kun" className="trend-img" />
                      <h3>#Trending Hashtag 5</h3>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-bottom box">
                <a href="/about-us">About</a>
                <a href="#">Privacy</a>
                <a href="/term-of-use">Terms of Use</a>
                <a href="#">Career</a>
              </div>
              <p style={{ color: "grey" }}> Momenify © 2020</p>
            </div>
          </div>
        </div>
        {/* <div className='side-posts-container'>
          <PostsContainer/>
        </div> */}
      </div>
    );
  }
}

export default Body;
