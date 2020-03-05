import React, { Component } from "react";
import "./about-us.css";

class AboutUs extends Component {
  render() {
    return (
      <div className="about-us">
        <h1 id="header"> About Us</h1>
        <br></br>
        <body id="body">
          Momenify is a platform that allow you to connect with other people.
        </body>
        <h2 id="h5">Express yourself</h2>
        <body id="body">
          Momenify is your friend circle. Post text messages, images, videos,
          audios, anything that you want to post.
        </body>
        <h2 id="h5">Be yourself</h2>
        <body id="body">
          Look at the posts that you are interested in. Post the comments about
          these posts. Make a post about yourself and your life.
        </body>
        <h2 id="h5">Connect with your people</h2>
        <body id="body">
          Join in the friend circle around the world. See something that
          interested you? Make a post about it and say your optional. You can
          follow the people that you are interested in, comment about their
          posts and even message with them.
        </body>
      </div>
    );
  }
}

export default AboutUs;
