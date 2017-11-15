/* eslint max-len:0 */
import React from "react";
import Outer from "../../../src/test/components/outer";
import Inner from "../../../src/test/components/inner";
import { shallow } from "enzyme";
import chai from "chai";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const expect = chai.expect;
const chaiShallowly = require("../../../src/index");
chai.use(chaiShallowly);

describe("Chai Shallowly", () => {
  let component;
  beforeEach(() => {
    component = (
      <Outer foo={10} />
    );
  });

  describe("ok", () => {
    it("should be okay with shallowly", () => {
      expect(component).to.shallowly.be.ok;
    });
    it("should not be okay with shallowly", () => {
      expect(() => {
        expect(undefined).to.not.shallowly.be.ok;
      }).to.throw();
    });
  });

  describe("haveClass", () => {
    it("should have the class", () => {
      expect(component).to.shallowly.haveClass("this-is-a-div");
    });
    it("should not have a different class", () => {
      expect(component).to.not.shallowly.haveClass("potato");
    });
    it("should only work with shallowly", () => {
      expect(() => {
        expect(component).to.not.haveClass("potato");
      }).to.throw();
    });
  });

  describe("match", () => {
    it("should not override existing matches", () => {
      expect("foobar").to.match(/^foo/);
    });
    it("should use css selectors with shallowly", () => {
      expect(component).to.shallowly.match("div");
      expect(component).to.shallowly.match(".this-is-a-div");
    });
    it("should also match for not selectors", () => {
      expect(component).to.not.shallowly.match("span");
    });
  });

  describe("containJSX", () => {
    it("should have Inner as a child", () => {
      expect(component).to.shallowly.containJSX(<Inner />);
    });
    it("should not have an Outer as a child", () => {
      expect(component).to.not.shallowly.containJSX(<Outer />);
    });
  });

  describe("find", () => {
    it("should find the child elements with class foo", () => {
      expect(component).to.shallowly.find(".foo");
    });
    it("should allow you to find an exact number", () => {
      expect(component).to.shallowly.find(".foo").to.have.length(3);
    });

    describe("filter", () => {
      it("should return an element with that selector", () => {
        expect(component).to.shallowly.find(".foo").filter(".bar").to.have.length(1);
      });
      it("should only work if `find` came first", () => {
        expect(() => {
          expect(component).to.shallowly.filter("#foo").to.have.length(2);
        }).to.throw();
      });
    });

    describe("without", () => {
      it("should filter results with `without`", () => {
        expect(component).to.shallowly.find(".foo").without("#foo").to.have.length(2);
      });
      it("should ony work after `find` has been called", () => {
        expect(() => {
          expect(component).to.shallowly.without("#foo").to.have.length(2);
        }).to.throw();
      });
    });
  });

  describe("text", () => {
    it("should allow you use inspect the text", () => {
      expect(component).to.shallowly.have.text().contain("text");
    });
  });

  describe("state", () => {
    it("should allow you to access the state", () => {
      expect(component).to.shallowly.have.state().to.eql({"coolState": "yay"});
    });
    it("should allow you to access specific state keys", () => {
      expect(component).to.shallowly.have.state("coolState").to.eql("yay");
    });
    it("should error if it doesn't exist", () => {
      expect(() => {
        expect(component).to.shallowly.have.state("POTATO").to.eql("yay");
      }).to.throw();
    });
  });

  describe("instanceProps", () => {
    it("should allow direct access to the instanceProps", () => {
      expect(component).to.shallowly.have.instanceProps().to.eql({"foo": 10});
    });
    it("should allow direct access to a specific prop", () => {
      expect(component).to.shallowly.have.instanceProps("foo").to.equal(10);
    });
  });

  describe("props", () => {
    it("should allow direct access to the instanceProps", () => {
      expect(component).to.shallowly.have.props().to.contain({"testProp": "sweet"});
    });
    it("should allow direct access to a specific prop", () => {
      expect(component).to.shallowly.have.props("testProp").to.equal("sweet");
    });
  });

  describe("type", () => {
    it("should allow checking the type", () => {
      expect(component).to.shallowly.have.type("div");
    });
  });

  describe("on", () => {
    it("should allow you to simulate an event", () => {
      expect(component).to.shallowly.find("a").on("click").to.have.state("coolState").to.eql("boo");
    });
    it("should work with existing shallow obects", () => {
      const shallowComponent = shallow(component);
      shallowComponent.find("a").simulate("click");
      expect(shallowComponent).to.shallowly.have.state("coolState").eql("boo");
    });
  });

  describe("withProps", () => {
    it("should allow you to set the instanceProps", () => {
      expect(component).to.shallowly.withProps({foo: 12}).to.have.instanceProps().eql({foo: 12});
    });
  });

  describe("withState", () => {
    it("should allow you to set the state", () => {
      expect(component).to.shallowly.withState({coolState: 12}).to.have.state().eql({coolState: 12});
    });
  });
});
