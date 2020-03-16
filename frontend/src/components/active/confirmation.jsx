import React, { Component } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
`;
export class Confirmation extends Component {
  render() {
    return (
      <Wrapper>
        <h2>
          An confirmation link has been sent to your email, the link will expire
          in 24 hours!
        </h2>
      </Wrapper>
    );
  }
}
