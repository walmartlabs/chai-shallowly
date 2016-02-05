import React from "react";
import Inner from "./inner.jsx";

export default class Outer extends React.Component {
  constructor() {
    super();
    this.state = {"coolState": "yay"};
  }

  render() {
    return (
      <div className="this-is-a-div" testProp="sweet">
        text
        <span className="foo bar">1</span>
        <span className="foo">2</span>
        <span className="foo" id="foo">3</span>
        <section className="bar"></section>
        <a
          className="click-me"
          onClick={() => {
            this.setState({"coolState": "boo"});
          }}>
          Click Me!
        </a>
        <Inner />
      </div>
    );
  }
}
