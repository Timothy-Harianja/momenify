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
    background-color: #e3ebfd; /* light blue */
    /* background-color: white; */
  }
  a,
  .navbar-nav,
  .navbar-light .nav-link {
    color: black;
    &:hover {
      color: white;
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
  };
  componentDidMount() {
    axios.get("/api/loginRoute/session").then((res) => {
      this.setState({
        userId: res.data.userId,
        postExpire: res.data.postInterval,
      });
    });
  }

  logout = () => {
    axios.post("/api/loginRoute/logout").then((res) => {});
  };
  render() {
    return (
      <Styles>
        <Navbar expand="lg">
          <Navbar.Brand href="/">Momenify</Navbar.Brand>
          <Form className="form-center">
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
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"
                          clip-rule="evenodd"
                        />
                        <path d="M5 8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/accountpage">
                      <svg
                        class="bi bi-people-circle"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
                        <path
                          fill-rule="evenodd"
                          d="M8 9a3 3 0 100-6 3 3 0 000 6z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/" onClick={() => this.logout()}>
                      <svg
                        class="bi bi-power"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.578 4.437a5 5 0 104.922.044l.5-.866a6 6 0 11-5.908-.053l.486.875z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M7.5 8V1h1v7h-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              ) : (
                <Nav>
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Styles>
    );
  }
}

export default Header;
