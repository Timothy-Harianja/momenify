import React, { Component } from "react";
import styled from "styled-components";
import "./thanks.css"
const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 40%;
  width: 100%;
  text-align: center;
  font-size: 18px;
`;
export const Thanks = () => (
  <div className="thanks">
  <Wrapper>
    <h1>Thanks you!</h1>
    <h3 id="confirm">Our team will get back to you soon!</h3>
  </Wrapper>
  </div>
);
