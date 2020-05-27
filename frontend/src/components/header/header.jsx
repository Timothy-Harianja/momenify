import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./header.css";
import styled from "styled-components";
import axios from "axios";

const Styles = styled.div`
  .navbar {
    background-color: #ffffff; /* light blue */
    border: solid;
    border-color: lightgrey;
    border-width: thin;

    /* background-color: white; */
  }
  a,
  .navbar-nav,
  .navbar-light .nav-link {
    color: black;
    &:hover {
      color: grey;
    }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: black;
    &:hover {
      color: white;
    }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
    width: 30%;
    margin: 0 auto;
    float: left;
  }
`;

class Header extends Component {
  state = {
    userId: null,
    postExpire: null,
    uniqueID: null,
    logo: null,
  };
  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      this.setState({
        userId: res.data.userId,
        postExpire: res.data.postInterval,
        uniqueID: res.data.uniqueID,
        logo: res.data.logoNumber,
      });
    });
  }

  render() {
    return (
      <Styles>
        <Navbar expand="lg">
          <Navbar.Brand href="/">
            {/* Momenify */}
            <img src={require("./Momenify.png")}></img>
          </Navbar.Brand>

          <Form className="form-center mobileResponsive">
            <FormControl type="text" placeholder="Search" className="" />
          </Form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {this.state.userId != undefined ? (
                <Nav>
                  <Nav.Item>
                    <Nav.Link href="/message">
                      <svg
                        class="bi bi-chat-dots"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        // fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                          clip-rule="evenodd"
                        />
                        <path d="M5 8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                      {this.props.sumPendingNumber > 0 ? (
                        <span class="message-notification">
                          {this.props.sumPendingNumber}
                        </span>
                      ) : null}
                    </Nav.Link>
                  </Nav.Item>
                  &nbsp;&nbsp;
                  <Nav.Item>
                    <Nav.Link href="/accountpage">
                      <svg
                        class="bi bi-gear-wide-connected"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        // fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9.928 1.723c-.243-.97-1.62-.97-1.863 0l-.072.286a.96.96 0 01-1.622.435l-.204-.212c-.695-.718-1.889-.03-1.614.932l.08.283a.96.96 0 01-1.186 1.187l-.283-.081c-.961-.275-1.65.919-.932 1.614l.212.204a.96.96 0 01-.435 1.622l-.286.072c-.97.242-.97 1.62 0 1.863l.286.071a.96.96 0 01.435 1.622l-.212.205c-.718.695-.03 1.888.932 1.613l.283-.08a.96.96 0 011.187 1.187l-.081.283c-.275.96.919 1.65 1.614.931l.204-.211a.96.96 0 011.622.434l.072.286c.242.97 1.62.97 1.863 0l.071-.286a.96.96 0 011.622-.434l.205.212c.695.718 1.888.029 1.613-.932l-.08-.283a.96.96 0 011.187-1.188l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205A.96.96 0 0115.983 10l.286-.071c.97-.243.97-1.62 0-1.863l-.286-.072a.96.96 0 01-.434-1.622l.212-.204c.718-.695.029-1.889-.932-1.614l-.283.08a.96.96 0 01-1.188-1.186l.081-.283c.275-.961-.918-1.65-1.613-.932l-.205.212A.96.96 0 0110 2.009l-.071-.286zm-.932 12.27a4.998 4.998 0 100-9.994 4.998 4.998 0 000 9.995z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M8.372 8.996L5.598 5.298l.8-.6 2.848 3.798h4.748v1H9.246l-2.849 3.798-.8-.6 2.775-3.698z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </Nav.Link>
                  </Nav.Item>
                  &nbsp;&nbsp;
                  <Nav.Item>
                    <Nav.Link href={"/profile/" + this.state.uniqueID}>
                      <img
                        className="post-item-header-profile2"
                        src={this.state.logo}
                      />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              ) : (
                <Nav>
                  <Nav.Item>
                    <Nav.Link href="/about-us">About</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                  </Nav.Item>
                </Nav>
              )}
              {/* <Nav.Item>
                <Nav.Link href="/about-us">About Us</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/term-of-use">Terms of Use</Nav.Link>
              </Nav.Item> */}

              <Form className="form-center mobilePopUp">
                <FormControl type="text" placeholder="Search" className="" />
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Styles>
    );
  }
}

export default Header;
