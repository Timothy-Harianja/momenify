import React, { Component } from "react";

import PostsContainer from "../posts-container/posts-container";

import "./body.css";
import TopRightContainer from "../posts-container/top-right-container";
import TrendContainer from "../posts-container/trend-container";
import kun from "./kun.png";
import Sidebar from "react-sidebar";

class Body extends Component {
  render() {
    return (
      <div className="home-page">
        <div className="main-posts-container">
          <PostsContainer />
        </div>
        <div className="side-posts-container">
          {/* <PostsContainer /> */}

          {/* <div class="wrapper">
            <div class="box header"><TopRightContainer /></div>
            <div class="box sidebar">Sidebar</div>

            <div class="box footer"><TrendContainer /></div>
          </div> */}

          <div class="wrapper">
            <div class="box top">
              <div id="sticky">
                <img src={kun} alt="kun" id="kun" />
                <button>follower</button>
                <button>following</button>
              </div>

              <TopRightContainer />
            </div>
            <div class="box middle">
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
            <div class="box bottom">
              <button>about</button>
              <button>privacy</button>
              <button>term of use</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Body;
