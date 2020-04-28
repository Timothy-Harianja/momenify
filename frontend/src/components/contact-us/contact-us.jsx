import React, { Component } from "react";
import "./contact-us.css";

class ContactUs extends Component{
render(){
return(
    <div className="contactus">
    <div class="container">
    <div class="row">
    <div class="col">

    </div>

  <div class="col-7">
  <h2 id="contactusheader">Contact Us</h2>
  <br></br>

  <div class="form-group row">
  <label  class="col-sm-2 col-form-label">Full name*</label>
  <div class="col-sm-10">
  <input type="text" class="form-control" />
  </div>
  </div>
  <hr></hr>
  <div class="form-group row">
  <label  class="col-sm-2 col-form-label">Email*</label>
  <div class="col-sm-10">
  <input type="text" class="form-control" />
  </div>
  </div>
<hr></hr>
  <div class="form-group row">
  <label class="col-sm-2 col-form-label">Message*</label>
  <div class="col-sm-10">
  <textarea id="contactmessage" type="text" class="form-control" />
  </div>
  </div>
<hr></hr>

 


</div>


<div class="col">

</div>
</div>
<footer>
<button id="contactssubmit" type="submit"  className="btn btn-primary">Send Application</button>
</footer>

</div>

</div>
);


}
}
export default ContactUs;