import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./scrollBar.css";

import $ from "jquery";

const MenuItem = ({
  text,
  key,
  selectedName,
  testNumber,
  getPendNum,
  unviewNum,
}) => {
  function handlePick() {
    alert("test");
  }
  return (
    <div>
      <span class="badge">{unviewNum}</span>
      <div
        className={`menu-item ${selectedName == text ? "active" : ""}`}
        // onClick={onSelectChatter(receiverId)}
      >
        {text}
      </div>
    </div>
  );
};

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });

const selected = "item1";

class ScrollBar extends Component {
  constructor(props) {
    super(props);
    // call it again if items count changes
    // this.menuItems = Menu(this.props.chatters, selected);
  }

  componentDidMount() {
    window.scrollTo(
      0,
      document.body.scrollHeight || document.documentElement.scrollHeight
    );

    $(document).ready(function () {
      $(window).scroll(function () {
        // console.log($(window).scrollTop());

        if ($(window).scrollTop() > 50) {
          $("#nav-bar").addClass("navbar-fixed-top");
        }

        if ($(window).scrollTop() < 51) {
          $("#nav-bar").removeClass("navbar-fixed-top");
        }
      });
    });
  }

  menu = () => {
    let list = this.props.chatters;
    // let selectedName = this.props.selectedInfo[0];
    let retVal = list.map((el) => {
      const name = el[0];
      const receiverId = el[1];
      const unviewNum = this.props.getPendNum(receiverId);
      return (
        <MenuItem
          text={name}
          key={receiverId}
          selectedName={this.props.selectedInfo[0]}
          testNumber={this.props.testNumber}
          getPendNum={(chatterId) => this.props.getPendNum(chatterId)}
          unviewNum={unviewNum}
        />
      );

      // return this.MenuItem({
      //   text: name,
      //   key: receiverId,
      //   selectedName: this.props.selectedInfo[0],
      //   testNumber: this.props.selectedInfo[0],
      //   // getPendNum: (chatterId) => this.props.getPendNum(chatterId)
      // });
    });
    return retVal;
  };

  onSelect = (key) => {
    // this.props.setupSocket();
    this.props.onSelectChatter(key);
  };

  render() {
    // Create menu from items
    const menu = this.menuItems;

    return (
      <div
        className="App"
        id="nav-bar"
        // style={{
        //   position: "fixed",
        //   padding: 0,
        //   margin: 0,
        //   overflow: "hidden",
        //   width: "100%",
        // }}
      >
        <ScrollMenu
          data={this.menu()}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={this.props.selected}
          onSelect={this.onSelect}

          // to={`chat/?name=${this.props.userID}&room=${this.props.selectedInfo[2]}`}
          // onClick={this.onSelect}
        />
      </div>
    );
  }
}

export default ScrollBar;
