import React, { Component } from "react";
import "./career.css";

class Career extends Component {
  render() {
    return (
      <div className="career">
        <form id="careerform" onSubmit={this.submitHandler}>
        <h1 id="careerheader">Careers</h1>
      <br></br>
        <h2 id="h5">Add Resume*</h2>
        <div class = "file btn btn-lg btn-light" id="resume">
              Select
          <input type="file" name="file" id="uploadresume" />
        </div>
       <br></br>
       <br></br>
        <h2 id="h5">Add Cover Letter*</h2>
        <div class = "file btn btn-lg btn-light" id="cover">
              Select
          <input type="file" name="file" id="uploadcover" />
        </div>
        <br></br>
        <br></br>
        <h2 id="h5">Personal Information</h2>
        <div id="personalinfo">
        <form role ="form">
        <div class="row">
        <div className="form-group col-sm-3 col-md-4 col-xs-5 col-lg-2">
        <label>First Name*:  </label>
        <input type="text" className="form-control input-normal" />
        </div>
        </div>
        <div class="row">
        <div className="form-group col-sm-3 col-md-4 col-xs-5 col-lg-2">
        <label> Last Name*:  </label>
        <input type="text" className="form-control input-normal" />
        </div>
        </div>
        <div class="row">
        <div className="form-group col-sm-3 col-md-4 col-xs-5 col-lg-2">
        <label> Phone: </label>
        <input  type="text" className="form-control input-normal"/>
        </div>
        </div>
        <div class="row">
        <div className="form-group col-sm-3 col-md-4 col-xs-5 col-lg-2">
        <label>Email*: </label>
        <input type="text" className="form-control input-normal"/>
        </div>
        </div>
        <br></br> 
       </form>
       <div class="row">
        <button type="submit"  className="btn btn-light" id="submit">Submit</button>
        </div>
        </div>
      </form>
      </div>
    );
  }
}

export default Career;