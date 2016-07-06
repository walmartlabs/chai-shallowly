var SHALLOW_FLAG = "shallow";

var isUndefined = function (obj) {
  return typeof obj === "undefined";
};

var isFunction = function (fx) {
  return typeof fx === "function";
};

var isEmpty = function (obj) {
  if (isUndefined(obj)
    || obj === null) {
    return true;
  }
  var empty = true;
  /* eslint-disable no-unused-vars */
  for (var prop in obj) {
    empty = false;
    break;
  }
  /* eslint-enable */
  return empty;
};

var plugin = function (chai, utils, enzyme) {
  var shallow = enzyme.shallow;
  var ShallowWrapper = enzyme.ShallowWrapper;

  var Assertion = chai.Assertion;

  var shallowMethod = function (assertName, assertFunc) {
    // Add new method.
    if (!isFunction(Assertion.prototype[assertName])) {
      return Assertion.addMethod(assertName, assertFunc);
    }

    // Overwrite existing method.
    Assertion.overwriteMethod(assertName, function (_super) {
      return function () {
        var component = utils.flag(this, SHALLOW_FLAG);
        if (!isEmpty(component)) {
          return assertFunc.apply(this, arguments);
        }

        _super.apply(this, arguments);
      };
    });
  };

  Assertion.addProperty("shallowly", function () {
    var assertionReference = utils.flag(this, "object");
    var component = assertionReference instanceof ShallowWrapper
      ? assertionReference
      : shallow(assertionReference);

    utils.flag(this, SHALLOW_FLAG, component);
  });

  shallowMethod("text", function () {
    this._obj = utils.flag(this, SHALLOW_FLAG).text();
  });

  shallowMethod("haveClass", function (classNames) {
    var component = utils.flag(this, SHALLOW_FLAG);
    this.assert(
      component.hasClass(classNames),
      "expected " + component.prop("className") + " to be #{exp}",
      "expected " + component.prop("className") + " to not have #{exp}"
    );
  });

  shallowMethod("match", function (selector) {
    var component = utils.flag(this, SHALLOW_FLAG);
    if (component) {
      this.assert(
        component.is(selector),
        "expected #{this} to be #{exp}",
        "expected #{this} to not be #{exp}"
      );
    }
  });

  shallowMethod("filter", function (selector) {
    new Assertion(utils.flag(this, "find")).to.be.true;
    utils.flag(this, "filter", true);
    this._obj = this._obj.filter(selector);
  });

  shallowMethod("containJSX", function (contained) {
    var component = utils.flag(this, SHALLOW_FLAG);
    if (component) {
      this.assert(
        component.containsMatchingElement(contained),
        "expected " + component.html() + " to contain " + contained,
        "expected #{this} to not be #{exp}"
      );
    }
  });

  shallowMethod("find", function (selector) {
    var component = utils.flag(this, SHALLOW_FLAG);
    var found = component.find(selector);
    this._obj = found;
    utils.flag(this, "find", true);
  });

  shallowMethod("without", function (selector) {
    new Assertion(utils.flag(this, "find")).to.be.true;
    utils.flag(this, "without", true);
    this._obj = this._obj.not(selector);
  });

  shallowMethod("state", function (state) {
    var component = utils.flag(this, SHALLOW_FLAG);
    var currentComponentState = component.state(state);
    this._obj = currentComponentState;
  });

  shallowMethod("props", function (props) {
    var component = utils.flag(this, SHALLOW_FLAG);
    if (isEmpty(props)) {
      this._obj = component.props();
    } else {
      this._obj = component.prop(props);
    }
  });

  shallowMethod("instanceProps", function (props) {
    var component = utils.flag(this, SHALLOW_FLAG);
    if (isEmpty(props)) {
      this._obj = component.instance().props;
    } else {
      this._obj = component.instance().props[props];
    }
  });

  shallowMethod("type", function (type) {
    var component = utils.flag(this, SHALLOW_FLAG);
    var expectedType = isFunction(type) ? type.name : type;

    this.assert(
      component.type(type) === type,
      "expected the component to have type " + expectedType + " but got " + component.type(type),
      "expected the component to not have type " + expectedType
    );
  });

  shallowMethod("on", function (event, data) {
    var component = utils.flag(this, SHALLOW_FLAG);
    var wasFound = utils.flag(this, "find");
    if (wasFound) {
      this._obj.simulate(event, data);
    } else {
      component.simulate(event, data);
    }
  });

  shallowMethod("withProps", function (props) {
    var component = utils.flag(this, SHALLOW_FLAG);
    component.setProps(props);
  });

  shallowMethod("withState", function (state) {
    var component = utils.flag(this, SHALLOW_FLAG);
    component.setState(state);
  });
};

// UMD wrapper.
/*global define:false*/
if (typeof exports === "object" && typeof module === "object") {
  // CommonJS
  //
  // chai.use(plugin)
  module.exports = function (chai, utils) {
    return plugin(chai, utils, require("enzyme"));
  };

} else if (typeof define === "function" && define.amd) {
  // AMD
  //
  // chai.use(plugin)
  define(["enzyme"], function (enzyme) {
    return function (chai, utils) {
      return plugin(chai, utils, enzyme);
    };
  });

} else {
  // VanillaJS
  throw new Error("Enzyme does not have a VanillaJS build");
}
