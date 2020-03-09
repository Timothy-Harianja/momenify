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
      <div>
        <div className="create-post-container">
          <div className="create-post">
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
                <div id="sticky">
                  <img src={kun} alt="kun" id="kun" />
                  <button>follower</button>
                  <button>following</button>
                </div>

                <TopRightContainer />
              </div>
              <div className="box middle">
                <div id="trend-list">
                  <ul>
                    <li>
                      <img src={kun} alt="kun" id="trend-img" />
                      <h3>The Grasslands</h3>
                      <p>Lorem</p>
                    </li>
                    <li>
                      <img src={kun} alt="kun" id="trend-img" />
                      <h3>The Grasslands</h3>
                      <p>Lorem</p>
                    </li>
                    <li>
                      <img src={kun} alt="kun" id="trend-img" />
                      <h3>The Grasslands</h3>
                      <p>Lorem</p>
                    </li>
                    <li>
                      <img src={kun} alt="kun" id="trend-img" />
                      <h3>The Grasslands</h3>
                      <p>Lorem</p>
                    </li>
                    <li>
                      <img src={kun} alt="kun" id="trend-img" />
                      <h3>The Grasslands</h3>
                      <p>Lorem</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box bottom">
                <button>about</button>
                <button>privacy</button>
                <button>term of use</button>
              </div>
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
