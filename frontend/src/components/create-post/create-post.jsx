import React, { Component } from "react";
import "./create-post.css";
import pic from "./imageicon.png";
import hash from "./hashtag.jpeg";
import posticon from "./posticon.png";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import Rodal from "rodal";
import { Button } from "react-bootstrap";
import "rodal/lib/rodal.css";
import reactScrollUpButton from "react-scroll-up-button";
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
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      username: null,
      uniqueID: null,
      postmessage: null,
      message: null,
      userLogo: null,
      fileName: "",
      hashtag: "",
      hashtagList: [],
      overlayState: false,
      files: null,
      progress: null,
      error: "",
      whiteSpace: "   ",
      empty: false,
      reachMax: false,
      progress: null,
    };
  }

  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      this.setState({
        userId: res.data.userId,
        username: res.data.username,
        userLogo: res.data.logoNumber,
        uniqueID: res.data.uniqueID,
      });
    });
  }

  show() {
    this.setState({ empty: true, reachMax: true });
  }

  hide() {
    this.setState({ empty: false, reachMax: false });
  }

  putMoment = (json) => {
    const formData = new FormData();
    formData.append("myFiles", this.state.files);

    if (this.state.postmessage != null && this.state.postmessage.trim() != "") {
      document.getElementById("post").setAttribute("disabled", true);
      document.getElementById("file").setAttribute("disabled", true);
      document.getElementById("tag").setAttribute("disabled", true);
      axios
        .post("/api/postRoute/upload", formData, {
          onUploadProgress: (progressEvent) => {
            this.setState({
              progress: Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              ),
            });
          },
        })
        .then((uploadResult) => {
          if (
            !uploadResult.data.success &&
            uploadResult.data.message == "file too large"
          ) {
            this.setState({
              error:
                "file is larger than 50MB, please compress it before upload.",
            });
            this.state.hashtagList = [];
            this.state.hashtag = "";
            document.getElementById("hashtaglabel").innerHTML = "";
            this.setState({ postmessage: null, fileName: null, files: null });
          } else {
            json.fileLocation = uploadResult.data.imageLocation;
            json.fileKey = uploadResult.data.key;
            json.fileType = uploadResult.data.fileType;
            axios.post("/api/postRoute/postMoment", json).then((res) => {
              if (res.data.success) {
                this.setState({ message: res.data.message, progress: null });
                document.getElementById("submitform").reset();

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

                this.props.addNewPost({
                  postDate: currentTime(),
                  hashtagList: this.state.hashtagList,
                  username: this.state.username,
                  postmessage: this.state.postmessage,
                  postId: res.data.postId,
                  userID: this.state.userId,
                  logoNumber: this.state.userLogo,
                  uniqueID: this.state.uniqueID,
                  file:
                    uploadResult.data.imageLocation == null
                      ? null
                      : uploadResult.data.imageLocation,
                });
                this.state.hashtagList = [];
                this.state.hashtag = "";
                document.getElementById("hashtaglabel").innerHTML = "";
                document.getElementById("post").removeAttribute("disabled");
                document.getElementById("file").removeAttribute("disabled");
                document.getElementById("tag").removeAttribute("disabled");
                this.setState({
                  postmessage: null,
                  fileName: null,
                  files: null,
                });
              } else {
                this.setState({
                  reachMax: true,
                  progress: null,
                  message: res.data.message,
                });
                document.getElementById("post").removeAttribute("disabled");
                document.getElementById("file").removeAttribute("disabled");
                document.getElementById("tag").removeAttribute("disabled");
                // this.setState({ message: res.data.message });
              }
            });
          }
        });
    } else {
      this.setState({ empty: true });
      // alert("Input cannot be empty");
    }
  };

  submitHandler = (e) => {
    e.preventDefault();
  };

  onChange = (e) => {
    switch (e.target.name) {
      case "selectedFile":
        if (e.target.files.length > 0 && e.target.files[0].size <= 50000000) {
          this.setState({
            fileName: "You have selected: " + e.target.files[0].name,
            files: e.target.files[0],
          });
        } else {
          alert("Please select a file that is less than 50MB!");
        }

        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  render() {
    const { hashtag } = this.state;

    let hashtaginputs = "";

    return (
      <div className="create-post">
        <form onSubmit={this.submitHandler} id="submitform">
          <textarea
            id="message"
            type="text"
            placeholder="What's on your mind? You can also upload a image or video."
            onChange={(e) => this.setState({ postmessage: e.target.value })}
          ></textarea>

          <div
            class="modal"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
            tabindex="-1"
            id="modal"
            role="dialog"
            onClick={() => {
              window.onclick = function (event) {
                if (event.target == this.document.getElementById("modal")) {
                  this.document.getElementById("modal").style.display = "none";
                }
              };
            }}
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content" id="modalcontent">
                <div class="modal-header">
                  <h5 class="modal-title">Enter Your Hashtag</h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      if (this.state.overlayState == true) {
                        this.setState({ overlayState: false });
                        document.getElementById("modal").style.display = "none";
                      }
                    }}
                  >
                    <span class="close">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <input
                    type="text"
                    id="hashtaginput"
                    name="hashtaginput"
                    placeholder="Enter Your Hashtag"
                    onChange={(e) => {
                      this.setState({ hashtag: e.target.value });
                    }}
                  />

                  <p>No space and special character.</p>
                </div>
                <div class="modal-footer">
                  <div>
                    <button
                      id="clear"
                      className="clear-btn btn btn-secondary"
                      onClick={(e) => {
                        this.state.hashtagList = [];
                        this.state.hashtag = "";
                        document.getElementById("hashtaglabel").innerHTML = "";
                        document.getElementById("hashtaginput").value = "";
                        document.getElementById("modal").style.display = "none";

                        e.preventDefault();
                      }}
                    >
                      Clear All Hashtags
                    </button>

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
                          document.getElementById("modal").style.display =
                            "none";
                          this.setState({ message: null });
                        }

                        return false;
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>{" "}
            </div>{" "}
          </div>

          <div className="buttons-container">
            <div className="div-container">
              <button
                type="tag"
                className="btn btn-light"
                id="tag"
                onClick={() => {
                  document.getElementById("modal").style.display = "block";

                  this.setState({ overlayState: true });
                }}
              >
                <img src={hash} alt="pic" id="pic" />
                Hashtag
              </button>

              <div class="file btn btn-lg btn-light" id="uploadbutton">
                <img src={pic} alt="pic" id="pic" />
                Media
                <input
                  id="file"
                  type="file"
                  accept="video/*,image/*"
                  name="selectedFile"
                  onChange={(event) => this.onChange(event)}
                />
              </div>

              <button
                type="post"
                className="btn btn-light"
                id="post"
                onClick={() => {
                  this.putMoment({
                    postmessage: this.state.postmessage,
                    userId: this.state.userId,
                    nickname: this.state.username,
                    currentDate: makeTime(),
                    postTime: currentTime(),
                    userLogo: this.state.userLogo,
                    hashtagList: this.state.hashtagList,
                    files: this.state.files,
                    uniqueID: this.state.uniqueID,
                  });
                }}
              >
                <img src={posticon} alt="pic" id="pic" />
                Post
              </button>
            </div>
            <Rodal
              width={350}
              visible={this.state.empty}
              onClose={this.hide.bind(this)}
              duration={600}
            >
              <div>
                <h5>Input cannot be empty</h5>
                <hr></hr>
                <p>
                  {" "}
                  Please input something to make a post, you can also upload a
                  image or video that is less than 50MB!
                </p>
                <Button
                  style={{ marginLeft: 230, marginTop: 25 }}
                  variant="primary"
                  onClick={() => {
                    this.setState({ empty: false });
                  }}
                >
                  Close
                </Button>
              </div>
            </Rodal>

            <Rodal
              width={350}
              visible={this.state.reachMax}
              onClose={this.hide.bind(this)}
              animation={"slideDown"}
              duration={600}
            >
              <div>
                <h5>You have reached the limit </h5>
                <hr></hr>
                <p>
                  {" "}
                  You have reached the max number of posts per day as anonymous,
                  please <a href="/login">login</a> or{" "}
                  <a href="signup"> sign up</a> to post more, as well as unlock
                  more features!
                </p>
                <Button
                  style={{ marginLeft: 230, marginTop: 5 }}
                  variant="primary"
                  onClick={() => {
                    this.setState({ reachMax: false });
                  }}
                >
                  Close
                </Button>
              </div>
            </Rodal>

            {this.state.progress != null && this.state.progress <= 100 ? (
              <div style={{ width: "100%" }}>
                Uploading:
                <ProgressBar
                  label={
                    this.state.progress == 100
                      ? "Almost done"
                      : this.state.progress + "%"
                  }
                  animated
                  now={this.state.progress}
                />
              </div>
            ) : (
              <div style={{ textDecorationLine: "underline" }}>
                {this.state.message}
              </div>
            )}

            {/* <div style={{ width: "50%" }}>
              <ProgressBar animated now={this.state.message} />
            </div> */}

            <div id="imagelabel" htmlFor="file">
              {this.state.fileName}
            </div>

            <div style={{ color: "red" }}>
              {this.state.whiteSpace + this.state.error}
            </div>

            <div id="hashtaglabel" htmlFor="hashtaginput">
              {hashtaginputs}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
