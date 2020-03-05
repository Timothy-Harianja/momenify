import React, { Component } from "react";

import PostsContainer from '../posts-container/posts-container';

import './body.css'

class Body extends Component {
  render() {
    return ( 
      <div className='home-page'>
        <div className='main-posts-container'>
          <PostsContainer/>
        </div>
        {/* <div className='side-posts-container'>
          <PostsContainer/>
        </div> */}
      </div>
    );
  }
}

export default Body;
