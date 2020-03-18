import React, { Component } from "react";
import "./about-us.css";

class AboutUs extends Component {
  render() {
    return (
      <div className="about-us">
        <br></br>
        <h1 id="header"> About Us</h1>
        <br></br>
        <h2 id="h5">
          • Momenify is a platform that allow you to connect with other people.
        </h2>
        <body id="body">
          Unlike most social media platform, where you have to register an
          account and add people to see their posts. At this platform, you can
          see everyone's moment around the world without creating an account!
          You can also make new friends from our platform.
        </body>{" "}
        <h2 id="h5">• How to use?</h2>
        <body id="body">
          You can post three moments per day as anonymous without login or
          signup. Once you register an account or login, you can do more thing,
          such as like and comment someone's post, post unlimited moments per
          day, and message someone!
        </body>
        <h2 id="h5">• Express yourself</h2>
        <body id="body">
          Momenify is your friend circle. Be creative, post moments that can
          attract people's attention. Or you can just post something that is on
          your mind!
        </body>
        <h2 id="h5">• Be yourself</h2>
        <body id="body">
          Look at the moments that you are interested in. Make comments about
          these moments. Make a moment about yourself and your life.
        </body>
        <h2 id="h5">• Connect with your people</h2>
        <body id="body">
          If you are interested in someone's moments, why don't you message them
          directly and make some new friends?
        </body>
        <br></br>
        <h2 id="h5">• Developers</h2>
        <body id="body">
          Backend Developer: Junjie Chen, Xingyu Liu
          <br></br>
          Frontend Developer: Dandan Zhao, Timothy Harianja
        </body>
      </div>
    );
  }
}

export default AboutUs;
