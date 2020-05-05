import React from "react";
import styled from "styled-components";
import "./404.css"
const Wrapper = styled.div`
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
`;
export const NoMatch = () => (
  <div className="notfound">
  <Wrapper>
    <h2>404 Not Found!</h2>
  </Wrapper>
  </div>
);
