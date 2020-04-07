import React, { Component } from "react";
import "./create-post.css";
import pic from "./imageicon.png";
import hash from "./hashtag.jpeg";
import posticon from "./posticon.png";
import axios from "axios";

function makeTime() {
  return new Date().getTime();
}

function currentTime() {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  return month + "-" + date + "-" + year;
}
class CreatePost extends Component {
  state = {
    userId: null,
    username: null,
    postmessage: null,
    message: null,
    userLogo: null,
    fileName: "",
    hashtag: "",
    tempHashTag: "",
  };

  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      this.setState({
        userId: res.data.userId,
        username: res.data.username,
        userLogo: res.data.logoNumber,
      });
    });
  }

  putMoment = (json) => {
    // console.log("this.json:", json);
    // console.log(this.state.postmessage);
    if (this.state.postmessage != null && this.state.postmessage.trim() != "") {
      // if (this.state.fileName != null) {
      //   var fd = new FormData();
      //   fd.append("image", this.state.imageFile, this.state.imageFile.name);
      // }

      axios.post("/api/postRoute/postMoment", json).then((res) => {
        if (res.data.success) {
          this.setState({ message: res.data.message });
          //past post information to body , then pass to post container
          this.props.addNewPost({
            username: this.state.username,
            postmessage: this.state.postmessage,
            postId: res.data.postId,
            logoNumber: this.state.userLogo,
            postDate: currentTime(),
          });
          this.setState({ postmessage: null });
        } else {
          this.setState({ message: res.data.message });
        }
      });
    } else {
      alert("Input cannot be empty");
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  fileSelectedHandler = (event) => {
    switch (event.target.name) {
      case "selectedFile":
        if (event.target.files.length > 0) {
          this.setState({ fileName: event.target.files[0].name });
        }
        break;
      default:
        this.setState({ [event.target.name]: event.target.value });
    }
    this.setState({ imageFile: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  render() {
    const { fileName } = this.state;

    let file = null;
    let hashtaginputs = "";

    file = fileName ? (
      <span>You have selected: {fileName}</span>
    ) : (
      <span></span>
    );

    return (
      <div className="create-post">
        <form onSubmit={this.submitHandler} id="submitform">
          <textarea
            id="message"
            type="text"
            placeholder="You can say something here."
            onChange={(e) => this.setState({ postmessage: e.target.value })}
          ></textarea>

          <div class="hashtagpp" id="hashtagid">
            <form id="hashtagform">
              <span
                class="close"
                onClick={() => {
                  const closeBtn = document.querySelector(".close");
                  closeBtn.addEventListener("click", () => {
                    document.getElementById("hashtagid").style.display = "none";
                    document.getElementById("cover").style.display = "none";
                  });
                }}
              >
                &times;
              </span>
              <h4>Enter Your Hashtag</h4>
              <input
                type="text"
                id="hashtaginput"
                name="hashtaginput"
                placeholder="enter your hashtag"
                onChange={(e) => {
                  this.setState({
                    tempHashTag: e.target.value,
                  });
                }}
              />
              <button
                id="hashtagsubmit"
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  this.state.hashtag += this.state.tempHashTag + ",";
                  this.state.tempHashTag = null;

                  document.getElementById("hashtaglabel").innerHTML =
                    "Hashtag: " + this.state.hashtag;

                  document.getElementById("hashtaginput").value = "";
                  document.getElementById("hashtagid").style.display = "none";
                  document.getElementById("cover").style.display = "none";
                  e.preventDefault();
                }}
              >
                Submit
              </button>
            </form>
          </div>
          <div id="cover"></div>
          <div className="buttons-container">
            {this.state.message}

            <div className="div-container">
              <button
                type="tag"
                className="btn btn-light"
                id="tag"
                onClick={() => {
                  document.getElementById("hashtagid").style.display = "block";
                  document.getElementById("cover").style.display = "block";
                }}
              >
                <img src={hash} alt="pic" id="pic" />
                Hashtag
              </button>

              <div class="file btn btn-lg btn-light" id="uploadbutton">
                <img src={pic} alt="pic" id="pic" />
                Photo
                <input
                  id="file"
                  type="file"
                  name="file"
                  name="selectedFile"
                  onChange={(event) => this.fileSelectedHandler(event)}
                />
              </div>

              <button
                type="post"
                className="btn btn-light"
                id="post"
                onClick={() => {
                  document.getElementById("submitform").reset();
                  this.putMoment({
                    postmessage: this.state.postmessage,
                    userId: this.state.userId,
                    nickname: this.state.username,
                    currentDate: makeTime(),
                    userLogo: this.state.userLogo,
                    postTime: currentTime(),
                  });
                }}
              >
                <img src={posticon} alt="pic" id="pic" />
                Post
              </button>
            </div>

            <label id="imagelabel" htmlFor="file">
              {file}
            </label>
            <br></br>
            <label id="hashtaglabel" htmlFor="hashtaginput">
              {hashtaginputs}
            </label>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
