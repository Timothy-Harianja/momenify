import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./post-dropdown.css";
import axios from "axios";

class PostDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportMessage: "",
      messageContent: "",
    };
  }

  follow = () => {
    if (this.props.id != null) {
      axios
        .post("/api/followChangeRoute/follow", { userid: this.props.id })
        .then((res) => {
          if (res.data.success) {
            this.props.updateFollow({ id: this.props.id, action: "follow" });
          } else {
            alert(res.data.message);
          }
        });
    } else {
      alert("You cannot follow an anonymous!");
    }
  };
  unfollow = () => {
    if (this.props.id != null) {
      axios
        .post("/api/followChangeRoute/unfollow", { userid: this.props.id })
        .then((res) => {
          if (res.data.success || res.data.message.includes("You unfollowed")) {
            this.props.updateFollow({ id: this.props.id, action: "unfollow" });
          }
        });
    }
  };

  reportConfig = (e) => {
    if (e.message.trim().length > 0) {
      document.getElementById("reportsubmit").removeAttribute("disabled");
    } else {
      document.getElementById("reportsubmit").setAttribute("disabled", true);
    }
    this.setState({ reportMessage: e.message });
  };

  render() {
    return (
      <Dropdown classname="dropdown">
        <div
          class="modal"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          tabindex="-1"
          id="confirmreport"
          role="dialog"
          onClick={() => {
            window.onclick = function (event) {
              if (
                event.target == this.document.getElementById("confirmreport")
              ) {
                this.document.getElementById("confirmreport").style.display =
                  "none";
              }
            };
          }}
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" id="modalcontent">
              <div class="modal-header">
                <h5 class="modal-title">Report</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("confirmreport").style.display =
                      "none";
                  }}
                >
                  <span class="close">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>Thanks for letting us know!</p>
                <p>
                  Your feedback is important in helping us keep the community
                  safe. Our team will take a look into the post.
                </p>
              </div>
              <div class="modal-footer">
                <div>
                  <button
                    className="btn btn-primary"
                    id="reportclose"
                    type="button"
                    onClick={(e) => {
                      document.getElementById("confirmreport").style.display =
                        "none";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          tabindex="-1"
          id="confirmmessage"
          role="dialog"
          onClick={() => {
            window.onclick = function (event) {
              if (
                event.target == this.document.getElementById("confirmmessage")
              ) {
                this.document.getElementById("confirmmessage").style.display =
                  "none";
              }
            };
          }}
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" id="modalcontent">
              <div class="modal-header">
                <h5 class="modal-title">Message</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("confirmmessage").style.display =
                      "none";
                  }}
                >
                  <span class="close">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>Your message has been successfully sent.</p>
              </div>
              <div class="modal-footer">
                <div>
                  <button
                    className="btn btn-primary"
                    id="messageclose"
                    type="button"
                    onClick={(e) => {
                      document.getElementById("confirmmessage").style.display =
                        "none";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          tabindex="-1"
          id="messagemodal"
          role="dialog"
          onClick={() => {
            window.onclick = function (event) {
              if (
                event.target == this.document.getElementById("messagemodal")
              ) {
                this.document.getElementById("messagemodal").style.display =
                  "none";
                this.document.getElementById("messageinput").value = "";
                this.document
                  .getElementById("messagesubmit")
                  .setAttribute("disabled", true);
              }
            };
          }}
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" id="modalcontent">
              <div class="modal-header">
                <h5 class="modal-title">Message</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("messagemodal").style.display =
                      "none";
                  }}
                >
                  <span class="close">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <textarea
                  type="text"
                  id="messageinput"
                  name="messageinput"
                  placeholder="Say something to this user."
                  onChange={(e) =>
                    this.setState({ messageContent: e.target.value })
                  }
                />
              </div>
              <div class="modal-footer">
                <div>
                  <button
                    id="messagesubmit"
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => {
                      this.props.sendMessage({
                        message: this.state.messageContent,
                      });
                      this.setState({ messageContent: "" });
                      document.getElementById("messageinput").value = "";
                      document.getElementById("messagemodal").style.display =
                        "none";
                      document.getElementById("confirmmessage").style.display =
                        "block";
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>

        <div
          class="modal"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          tabindex="-1"
          id="reportmodal"
          role="dialog"
          onClick={() => {
            window.onclick = function (event) {
              if (event.target == this.document.getElementById("reportmodal")) {
                this.document.getElementById("reportmodal").style.display =
                  "none";
                this.document.getElementById("reportinput").value = "";
                this.document
                  .getElementById("reportsubmit")
                  .setAttribute("disabled", true);
              }
            };
          }}
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" id="modalcontent">
              <div class="modal-header">
                <h5 class="modal-title">Report</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("reportmodal").style.display =
                      "none";
                  }}
                >
                  <span class="close">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <textarea
                  type="text"
                  id="reportinput"
                  name="reportnput"
                  placeholder="Reason to report this user/post"
                  onChange={(e) =>
                    // this.props.setReport({ message: e.target.value })
                    this.reportConfig({ message: e.target.value })
                  }
                />
              </div>
              <div class="modal-footer">
                <div>
                  <button
                    id="reportsubmit"
                    // disabled
                    type="submit"
                    className="btn btn-primary"
                    onClick={(e) => {
                      if (this.state.reportMessage.trim().length > 0) {
                        setTimeout(() => {
                          document.getElementById("reportinput").value = "";
                          document.getElementById("reportmodal").style.display =
                            "none";
                          document.getElementById(
                            "confirmreport"
                          ).style.display = "block";
                          this.props.reportPost({
                            message: this.state.reportMessage,
                          });
                        }, 500);
                        setTimeout(() => {
                          this.setState({ reportMessage: "" });
                        }, 1000);
                      } else {
                        alert("Report message cannot be empty!");
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>

        <div
          class="modal"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          tabindex="-1"
          id="deletemodal"
          role="dialog"
          onClick={() => {
            window.onclick = function (event) {
              if (event.target == this.document.getElementById("deletemodal")) {
                this.document.getElementById("deletemodal").style.display =
                  "none";
              }
            };
          }}
        ></div>

        <Dropdown.Toggle
          className="dropdown-toggle"
          variant=""
          id="dropdown-basic"
        >
          <svg
            class="bi bi-justify"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M2 12.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"
              clip-rule="evenodd"
            />
          </svg>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu">
          {this.props.owned ? (
            <Dropdown.Item>
              <svg
                class="bi bi-info-circle"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"
                  clip-rule="evenodd"
                />
                <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z" />
                <circle cx="8" cy="4.5" r="1" />
              </svg>
              <span>Own Post</span>
            </Dropdown.Item>
          ) : null}
          {!this.props.owned && this.props.id != null ? (
            this.props.followStatus ? (
              <Dropdown.Item onClick={() => this.unfollow()}>
                <svg
                  class="bi bi-person-dash"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM6 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm2 2.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Unfollow</span>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item onClick={() => this.follow()}>
                <svg
                  class="bi bi-person-plus"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM1.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM6 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0zm4.5 0a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1H13V5.5a.5.5 0 01.5-.5z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M13 7.5a.5.5 0 01.5-.5h2a.5.5 0 010 1H14v1.5a.5.5 0 01-1 0v-2z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Follow</span>
              </Dropdown.Item>
            )
          ) : null}

          {!this.props.owned && this.props.id != null ? (
            <Dropdown.Item
              onClick={() => {
                this.props.checkLogin({ position: this.props.position })
                  ? alert("Please login")
                  : (document.getElementById("messagemodal").style.display =
                      "block");
              }}
            >
              <svg
                class="bi bi-chat"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Message</span>
            </Dropdown.Item>
          ) : null}

          {!this.props.owned ? (
            <Dropdown.Item
              onClick={() => {
                document.getElementById("reportmodal").style.display = "block";
                this.props.reportID({ id: this.props.postid });
              }}
            >
              <svg
                class="bi bi-x-circle"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Report</span>
            </Dropdown.Item>
          ) : (
            <div></div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default PostDropdown;
