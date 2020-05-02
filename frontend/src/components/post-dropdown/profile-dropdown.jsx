import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./post-dropdown.css";
import axios from "axios";

class ProfileDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // followStatus: false,
      // userId: this.props.userId,
    };
  }
  delete = (obj) => {
    console.log("delete: ", obj);
    this.props.deletePost({ postid: this.props.position });
  };

  render() {
    console.log("current post id: ", this.props.position);

    return (
      <Dropdown classname="dropdown">
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
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content" id="modalcontent">
              <div class="modal-header">
                <h5 class="modal-title">Delete</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("deletemodal").style.display =
                      "none";
                  }}
                >
                  <span class="close">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>
                  Are you sure you want to permanently remove this post from
                  Momenify?
                </p>
              </div>
              <div class="modal-footer">
                <div>
                  <button
                    id="deletebutton"
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      document.getElementById("deletemodal").style.display =
                        "none";
                      this.delete();
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    id="deletecancel"
                    type="button"
                    onClick={(e) => {
                      document.getElementById("deletemodal").style.display =
                        "none";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>{" "}
          </div>{" "}
        </div>

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
          <Dropdown.Item
            onClick={() => {
              document.getElementById("deletemodal").style.display = "block";
            }}
          >
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path
                fill="none"
                d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667
								c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14
								c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583
								C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167
								c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083
								z"
              ></path>
            </svg>
            <span>Delete</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default ProfileDropDown;
