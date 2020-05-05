import React from "react";
import styled from "styled-components";
import "./resetPassword.css";
const Wrapper = styled.div`
position: absolute;
left: 0;
top: 40%;
width: 100%;
text-align: center;
font-size: 18px;
background-color:#fafafa;
`;
export const ResetConfirmation = () => (
  <div className="confirmreset">
 <Wrapper>
  
    <h1> Reset Password</h1>
    <h3>
      An reset password confirmation link has been sent to your email, the link will
      expire in 15 minutes!
    </h3>

  </Wrapper>
  </div>
);
