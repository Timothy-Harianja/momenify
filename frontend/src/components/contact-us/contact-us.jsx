import React, { Component } from "react";
import "./contact-us.css";
import axios from "axios";
class ContactUs extends Component {
  state = {
    name: null,
    email: null,
    message: null,
  };
  submit = (obj) => {
    if (
      this.state.name == null ||
      this.state.email == null ||
      this.state.message == null ||
      this.state.name.trim() == "" ||
      this.state.email.trim() == "" ||
      this.state.message.trim() == ""
    ) {
      alert("One of the input is missing!");
    } else if (
      !this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    ) {
      alert("Email is in wrong format!");
    } else {
      axios.post("/api/config/contact-us", obj).then((res) => {
        if (res.data.success) {
          this.props.history.push("/thanks");
        }
      });
    }
  };

  render() {
    return (
      <div className="contactus">
        <div class="container">
          <div class="row">
            <div class="col"></div>

            <div class="col-7">
              <h2 id="contactusheader">Contact Us</h2>
              <br></br>

              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Full name*</label>
                <div class="col-sm-10">
                  <input
                    required
                    type="text"
                    class="form-control"
                    id="contactusname"
                    placeholder="Username"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Email*</label>
                <div class="col-sm-10">
                  <input
                    required
                    type="email"
                    id= "contactusemail"
                    class="form-control"
                    placeholder="Email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Message*</label>
                <div class="col-sm-10">
                  <textarea
                    required
                    id="contactmessage"
                    type="text"
                    class="form-control"
                    placeholder="Input your message here..."
                    onChange={(e) => this.setState({ message: e.target.value })}
                  />
                </div>
              </div>
              <hr></hr>
            </div>

            <div class="col"></div>
          </div>
          <footer>
            <button
              id="contactssubmit"
              type="submit"
              className="btn btn-primary"
              onClick={() =>
                this.submit({
                  name: this.state.name,
                  email: this.state.email,
                  message: this.state.message,
                })
              }
            >
              Submit
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
export default ContactUs;
