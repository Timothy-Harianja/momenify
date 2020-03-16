import React, { Component } from "react";
// export const TestProps = () => (
//   <Wrapper>
//     <h2>{this.props}</h2>
//   </Wrapper>
// );
class TestProps extends Component {
  render() {
    return (
      // <Wrapper>
      <h2>{this.props.content}</h2>
      // </Wrapper>
    );
  }
}
export default TestProps;
