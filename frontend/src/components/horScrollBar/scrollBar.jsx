import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./scrollBar.css";

// One item component
// selected prop will be passed
const MenuItem = ({ text, key, selectedName, onSelectChatter }) => {
  return (
    <div>
      <span class="badge">0</span>
      <div
        className={`menu-item ${selectedName == text ? "active" : ""}`}
        // onClick={onSelectChatter(receiverId)}
      >
        {text}
      </div>
    </div>
  );
};

// All items component
// Important! add unique key
// export const Menu = (list, selected) =>
//   list.map((el) => {
//     // console.log("el ", el[0]);
//     const { name } = el;

//     return <MenuItem text={name} key={name} selected={selected} />;
//   });

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
    console.log("hello", this.props.chatters);
  }

  menu = () => {
    let list = this.props.chatters;
    // let selectedName = this.props.selectedInfo[0];
    let retVal = list.map((el) => {
      // console.log("el ", el);
      const name = el[0];
      const receiverId = el[1];
      {
      }

      return (
        // <React.Fragment>
        <MenuItem
          text={name}
          key={receiverId}
          selectedName={this.props.selectedInfo[0]}
        />
        // </React.Fragment>
      );
    });
    return retVal;
  };

  onSelect = (key) => {
    console.log("what is the key", key);
    // this.props.setupSocket();
    this.props.onSelectChatter(key);
  };

  render() {
    // Create menu from items
    const menu = this.menuItems;

    return (
      <div className="App">
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
