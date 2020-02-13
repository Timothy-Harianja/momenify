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

class Header extends Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand
          href="#home"
          onSelect={() => {
            this.props.setBody(<Body />);
          }}
        >
          Moment Chat
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="">
            <Nav.Link
              href="#login"
              onSelect={() => {
                this.props.setBody(<Login />);
              }}
            >
              Login
            </Nav.Link>
            <Nav.Link
              href="#signup"
              onSelect={() => {
                this.props.setBody(
                  <Signup setBody={this.props.setBody} api={this.props.api} />
                );
              }}
            >
              Sign Up
            </Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">About us</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Career</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">TBD</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">TBD </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="search-bar" inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2 myClass"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
