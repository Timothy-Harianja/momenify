import React, { Component } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 40%;
  width: 100%;
  text-align: center;
  font-size: 18px;
`;
export const Confirmation = () => (
  <Wrapper>
    <h1>Thanks for Sign Up!</h1>
    <h3 id="confirm">
      You will receive an email shortly, please active in 24 hours!
    </h3>
  </Wrapper>
);
