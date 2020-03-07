import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Login from "../login/login.jsx";
import Signup from "../signup/signup.jsx";
import Body from "../body/body.jsx";
import "./header.css";
import styled from "styled-components";
import session from "express-session";
import axios from "axios";

const Styles = styled.div`
  .navbar {
    background-color: #e3ebfd;
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
    userId: null
  };
  componentDidMount() {
    axios.get("/api/loginRoute/session").then(res => {
      console.log(res.data);
      this.setState({ userId: res.data.userId });
    });
  }

  logout = () => {
    axios.post("/api/loginRoute/logout").then(res => {
      console.log("logout done!");
    });
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
                    <Nav.Link href="/accountpage">My Account</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      href="/"
                      type="submit"
                      onClick={() => this.logout()}
                    >
                      Logout
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
