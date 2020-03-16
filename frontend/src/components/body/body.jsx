import React, { Component } from "react";
import PostsContainer from "../posts-container/posts-container";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button"; //Add this line Here
import "./body.css";
import TopRightContainer from "../posts-container/top-right-container";
import TrendContainer from "../posts-container/trend-container";
import kun from "./kun.png";
import anonymous from "../posts-container/anonymous.png";
import CreatePost from "../create-post/create-post";
import axios from "axios";
import logo1 from "../images/logo1.png";
import logo2 from "../images/logo2.png";
import logo3 from "../images/logo3.png";
import logo4 from "../images/logo4.png";
import logo5 from "../images/logo5.png";
import logo6 from "../images/logo6.png";
import logo7 from "../images/logo7.png";
import logo8 from "../images/logo1.png";
import logo9 from "../images/logo9.png";

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      logoNumber: null
    };
  }

  componentDidMount() {
    axios.get("/api/loginRoute/session").then(res => {
      this.setState({
        userId: res.data.userId,
        logoNumber: res.data.logoNumber
      });
    });
  }

  getLogo = num => {
    let list = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9];
    return list[parseInt(num) - 1];
  };
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
                  <img
                    src={
                      this.state.userId == null
                        ? anonymous
                        : this.getLogo(this.state.logoNumber)
                    }
                    alt="kun"
                    id="side-profile"
                  />
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
        <ScrollUpButton />
      </div>
    );
  }
}

export default Body;
