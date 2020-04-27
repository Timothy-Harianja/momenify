import React, { Component } from "react";
import "./career.css";

class Career extends Component {
  state ={
    files: null,
    resume: ""

  }
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

  onChangeResume = (e) => {
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



  render() {
    return (
      <div className="career">
      <div class="container">
      <div class="row">
      <div class="col">

      </div>
  
    <div class="col-7">
    <h1>Careers</h1>
    <br></br>

    <div class="form-group row">
    <label  class="col-sm-2 col-form-label">Full name*</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" />
    </div>
    </div>
    <hr></hr>
    <div class="form-group row">
    <label  class="col-sm-2 col-form-label">Phone</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" />
    </div>
    </div>
<hr></hr>
    <div class="form-group row">
    <label class="col-sm-2 col-form-label">Email*</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" />
    </div>
    </div>
<hr></hr>
  
    <div class="form-group row">
    <label class="col-sm-2 col-form-label">Resume*</label>
    <div class="col-sm-10">
    <div class = "file btn btn-lg btn-light" id="resume">
    Choose file <input id="file" type="file" name="selectedFile" id="uploadresume" accept="application/*" onChange={(event) => this.onChange(event)}/>
    
    </div>
    <div  htmlFor="file">{this.state.resume} </div>
    </div>
    </div>
<hr></hr>
  
 
  </div>
 
  
  <div class="col">

  </div>
  </div>
  <footer>
  <button id="careerssubmit" type="submit"  className="btn btn-primary">Send Application</button>
  </footer>
  
  </div>
  
  </div>
    );
  }
}

export default Career;