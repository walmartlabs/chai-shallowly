***
# NOTICE:

## This repository has been archived and is not supported.

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
***
NOTICE: SUPPORT FOR THIS PROJECT HAS ENDED 

This projected was owned and maintained by Walmart. This project has reached its end of life and Walmart no longer supports this project.

We will no longer be monitoring the issues for this project or reviewing pull requests. You are free to continue using this project under the license terms or forks of this project at your own risk. This project is no longer subject to Walmart's bug bounty program or other security monitoring.


## Actions you can take

We recommend you take the following action:

  * Review any configuration files used for build automation and make appropriate updates to remove or replace this project
  * Notify other members of your team and/or organization of this change
  * Notify your security team to help you evaluate alternative options

## Forking and transition of ownership

For [security reasons](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/), Walmart does not transfer the ownership of our primary repos on Github or other platforms to other individuals/organizations. Further, we do not transfer ownership of packages for public package management systems.

If you would like to fork this package and continue development, you should choose a new name for the project and create your own packages, build automation, etc.

Please review the licensing terms of this project, which continue to be in effect even after decommission.

chai-shallowly
==============

A chai assertion plugin for enzyme.
The goal of this assertion plugin is to allow you to use a chai-like
synax with enzyme.

The syntax looks like this:
```jsx
let component = <Foo />;
expect(component).to.shallowly.haveClass("this-is-a-class");
```
If you want to shallowly render something and use this API you
_must_ include the keyword `shallowly`. The rest should work as
you expect.

*NOTE:* This does not change the context of chai.
`expect(component).to.shallowly.be.ok` will check against component
not the shallow version of it. This is an intentional design choice.

## Integration With Karma and Webpack

Enzyme is currently not expecting to be bundled in to one large file.
This causes problems with Karma and Webpack. You will likely see hundreds
of nearly nonsensical error messages that boil down to a few things:

1. Webpack expects a few globals to be announced.
2. Webpack needs to _not_ parse sinon and just import it.

Here is the config we used (you can check out the entire config in the source):

```js
externals: {
  jsdom: "window",
  cheerio: "window",
  "react/lib/ExecutionEnvironment": true,
  "react/lib/ReactContext": true
},
resolve: {
  alias: {
    sinon: require.resolve("sinon/pkg/sinon")
  }
},
module: {
  noParse: [
    /node_modules\/sinon\//
  ]
}
```

If you want Enzyme (and chai-enzyme) to work with Karma and Webpack you will
need to add these to your test-only config.

## API

You can check out the tests for more explicit coverage and usages.
Here I will cover what we have done so far.
```jsx
// hasClass
expect(shallow(component).hasClass("class")).to.be.true;
expect(component).to.shallowly.haveClass("class");

// text
expect(shallow(component).text()).to.equal("text");
expect(component).to.shallowly.have.text().equal("text");

// is
expect(shallow(component).is("div")).to.be.true;
expect(component).to.shallowly.match("div");

// type
expect(shallow(component).type("div")).to.be.true;
expect(component).to.shallowly.have.type("div");


// find
expect(shallow(component).find(".foo")).to.have.length(2);
expect(component).to.shallowly.find(".foo").to.have.length(2);

// filter
expect(shallow(component).find(".foo").filter(".bar")).to.have.length(1);
expect(component).to.shallowly.find(".foo").filter(".bar").to.have.length(1);

// not
expect(shallow(component).find(".foo").not(".bar")).to.have.length(1);
expect(component).to.shallowly.find(".foo").without(".bar").to.have.length(1);

// contains
expect(shallow(component).contains("div")).to.be.true;
expect(component).to.shallowly.containJSX("div");

// state
expect(shallow(component).state(state)).to.eql({"foo": "bar"});
expect(component).to.shallowly.have.state(state).eql({"foo": "bar"});

// props
expect(shallow(component).instance().props(propKey)).to.eql(propValue);
expect(component).to.shallowly.have.props(propKey).eql(propValue);

// simulate
/* all of this */
var shallowComponent = shallow(component);
shallowComponent.simulate("click");
expect(shallowComponent.state()).to.eql({"state":"clicked"});

/* vs */
expect(component).to.shallowly.on("click").have.state().eql({"state":"clicked"});

// setState / setProps
var shallowComponent = shallow(component);
shallowComponent.setState(state);
expect(shallowComponent.state()).to.equal(state);

expect(component).to.shallowly.withState(state).to.have.state().equal(state);
```
