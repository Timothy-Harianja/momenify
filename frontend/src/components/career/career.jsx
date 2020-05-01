import React, { Component } from "react";
import "./career.css";
import Axios from "axios";

class Career extends Component {
  state = {
    files: null,
    resume: "",
    position: "",
    name: "",
    email: "",
    phone: "",
    message: null,
  };
  onChange = (e) => {
    switch (e.target.name) {
      case "selectedFile":
        if (e.target.files.length > 0 && e.target.files[0].size <= 50000000) {
          this.setState({
            resume: "You have selected: " + e.target.files[0].name,
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

  handleChange = (e) => {
    this.setState({ position: e.target.value });
  };

  submit = (obj) => {
    if (
      this.state.name.trim() == "" ||
      this.state.email.trim() == "" ||
      this.state.position == ""
    ) {
      alert("One of the input is missing!");
    } else if (
      !this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    ) {
      alert("Email is in wrong format!");
    } else if (this.state.phone.length != 10) {
      alert("Phone number format incorrect");
    } else if (this.state.files == null) {
      alert("Please upload a resume!");
    } else {
      document.getElementById("careerssubmit").setAttribute("disabled", true);
      const formData = new FormData();
      formData.append("myFiles", this.state.files);

      Axios.post("/api/config/uploadLogo", formData).then((res) => {
        if (res.data.success) {
          obj.resumeLink = res.data.imageLocation;
          Axios.post("/api/config/career", obj).then((res2) => {
            if (res2.data.success) {
              document
                .getElementById("careerssubmit")
                .removeAttribute("disabled");

              this.props.history.push("/thanks");
            }
          });
        }
      });
    }
  };

  render() {
    return (
      <div className="career">
        <div class="container">
          <div class="row">
            <div class="col"></div>

            <div class="col-7">
              <h1>Careers</h1>
              <br></br>

              <span>Position seeking: </span>
              <select
                id="position"
                value={this.state.position}
                onChange={this.handleChange}
              >
                <option value=""></option>
                <option value="frontend">Software engineer - frontend</option>
                <option value="backend">Software engineer - backend</option>
                <option value="fullstack">Software engineer - fullstack</option>
                <option value="marketing">Digital Marketing</option>
              </select>
              <br></br>
              <br></br>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Full name*</label>
                <div class="col-sm-10">
                  <input
                    required
                    type="text"
                    class="form-control"
                    placeholder="Full name"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Phone</label>
                <div class="col-sm-10">
                  <input
                    required
                    type="number"
                    class="form-control"
                    placeholder="10 digits please"
                    onChange={(e) => this.setState({ phone: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Email*</label>
                <div class="col-sm-10">
                  <input
                    required
                    type="text"
                    class="form-control"
                    placeholder="Email address"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Message</label>
                <div class="col-sm-10">
                  <textarea
                    required
                    id="contactmessage"
                    type="text"
                    class="form-control"
                    placeholder="Your message to HR"
                    onChange={(e) => this.setState({ message: e.target.value })}
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Resume*</label>

                <div class="col-sm-10">
                  <div class="file btn btn-lg btn-light" id="resume">
                    Upload resume(PDF only){" "}
                    <input
                      id="file"
                      type="file"
                      name="selectedFile"
                      id="uploadresume"
                      accept=".pdf"
                      onChange={(event) => this.onChange(event)}
                    />
                  </div>
                  <div htmlFor="file">{this.state.resume} </div>
                </div>
              </div>
              <hr></hr>
            </div>

            <div class="col"></div>
          </div>
          <footer>
            <button
              id="careerssubmit"
              type="submit"
              className="btn btn-primary"
              onClick={() =>
                this.submit({
                  position: this.state.position,
                  name: this.state.name,
                  email: this.state.email,
                  phone: this.state.phone,
                  message: this.state.message,
                })
              }
            >
              Send Application
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

export default Career;
