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
    hashtagList: [],
    overlayState: false,
    files: null,
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
    // put image to local
    // console.log("this.state.files put momment: ", this.state.files);
    const formData = new FormData();
    formData.append("myFiles", this.state.files);

    if (this.state.postmessage != null && this.state.postmessage.trim() != "") {
      //   const config = {
      //     headers: {
      //         'content-type': 'multipart/form-data'
      //     }
      // };

      // console.log("upload before", this.state.files);
      // let request = { files: json, formData: formData };
      axios.post("/api/postRoute/upload", formData).then((uploadResult) => {
        // console.log("uploadResult.data", uploadResult.data);
        json.files = uploadResult.data.files;
        axios.post("/api/postRoute/postMoment", json).then((res) => {
          if (res.data.success) {
            this.setState({ message: res.data.message });
            //past post information to body , then pass to post container
            //     console.log("res: ", res.data.postId);
            if (this.state.hashtagList.length > 0) {
              axios
                .post("/api/postRoute/postHashtag", {
                  hashtagList: this.state.hashtagList,
                  currentTime: makeTime(),
                  postID: res.data.postId,
                })
                .then((res) => {
                  console.log(res);
                });
            }
            //   console.log("uploadResult.data", uploadResult.data);

            this.props.addNewPost({
              postDate: currentTime(),
              hashtagList: this.state.hashtagList,
              username: this.state.username,
              postmessage: this.state.postmessage,
              postId: res.data.postId,
              userID: this.state.userId,
              logoNumber: this.state.userLogo,
              file:
                uploadResult.data.files == null
                  ? null
                  : uploadResult.data.files.filename,
            });
            this.state.hashtagList = [];
            this.state.hashtag = "";
            document.getElementById("hashtaglabel").innerHTML = "";
            this.setState({ postmessage: null });
          } else {
            this.setState({ message: res.data.message });
          }
        });
      });
    } else {
      alert("Input cannot be empty");
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  onChange = (e) => {
    switch (e.target.name) {
      case "selectedFile":
        if (e.target.files.length > 0) {
          //   console.log("input files:", e.target.files[0]);

          this.setState({
            fileName: e.target.files[0].name,
            files: e.target.files[0],
          });
          // this.setState({ files: formData });
        }
        // console.log("files,", this.state.files);

        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  render() {
    const { fileName } = this.state;
    const { hashtag } = this.state;
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
                    document.getElementById("overlay").style.display = "none";
                    this.setState({ overlayState: false });
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
                placeholder="Enter Your Hashtag"
                onChange={(e) => {
                  this.setState({ hashtag: e.target.value });
                }}
              />
              No space and special character.
              <div>
                <button
                  id="hashtagsubmit"
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    if (hashtag == null || hashtag == "") {
                      alert("Hashtag cannot be empty!");
                    } else if (!hashtag.match("^[A-Za-z0-9]+$")) {
                      alert("Hashtag can only contains letter or digit!");
                    } else {
                      this.state.hashtagList.push("#" + hashtag);
                      this.state.hashtag = "";
                      document.getElementById("hashtaglabel").innerHTML =
                        "Hashtag(s): " + this.state.hashtagList;
                      document.getElementById("hashtaginput").value = "";
                      document.getElementById("hashtagid").style.display =
                        "none";
                      document.getElementById("overlay").style.display = "none";
                    }

                    return false;
                  }}
                >
                  Submit
                </button>
                <button
                  className="clear-btn btn btn-primary"
                  onClick={(e) => {
                    this.state.hashtagList = [];
                    this.state.hashtag = "";
                    document.getElementById("hashtaglabel").innerHTML = "";
                    document.getElementById("hashtaginput").value = "";
                    document.getElementById("hashtagid").style.display = "none";
                    document.getElementById("overlay").style.display = "none";
                    e.preventDefault();
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
          <div
            id="overlay"
            onClick={() => {
              if (this.state.overlayState == true) {
                this.setState({ overlayState: false });
                document.getElementById("hashtagid").style.display = "none";
                document.getElementById("overlay").style.display = "none";
              }
            }}
          ></div>
          <div className="buttons-container">
            {this.state.message}

            <div className="div-container">
              <button
                type="tag"
                className="btn btn-light"
                id="tag"
                onClick={() => {
                  document.getElementById("hashtagid").style.display = "block";
                  document.getElementById("overlay").style.display = "block";
                  this.setState({ overlayState: true });
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
                  accept="image/*"
                  name="selectedFile"
                  onChange={(event) => this.onChange(event)}
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
                    postTime: currentTime(),
                    userLogo: this.state.userLogo,
                    hashtagList: this.state.hashtagList,
                    files: this.state.files,
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
