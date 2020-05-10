import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";
import "./scrollBar.css";

// list of items
const chatters = [
  { name: "item1" },
  { name: "item2" },
  { name: "item3" },
  { name: "item4" },
  { name: "item5" },
  { name: "item6" },
  { name: "item7" },
  { name: "item8" },
  { name: "item10" },
  { name: "item11" },
  { name: "item12" },
  { name: "item13" },
  { name: "item14" },
];

// One item component
// selected prop will be passed
const MenuItem = ({ text, selected }) => {
  return <div className={`menu-item ${selected ? "active" : ""}`}>{text}</div>;
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.map((el) => {
    console.log("el ", el[0]);
    const { name } = el;

    return <MenuItem text={name} key={name} selected={selected} />;
  });

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
    this.state = {
      selected: null,
    };
    this.menuItems = Menu(this.props.chatters, selected);
  }

  componentDidMount() {
    console.log("hello", this.props.chatters);
    let selected = this.props.chatters;
    this.setState({ selected: selected });
  }
  onSelect = (key) => {
    console.log(key);
  };

  render() {
    // Create menu from items
    const menu = this.menuItems;

    return (
      <div className="App">
        <ScrollMenu
          data={this.props.menuItems}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={this.props.selected}
          onSelect={(key) => this.props.onSelectChatter(key)}
        />
      </div>
    );
  }
}

export default ScrollBar;
