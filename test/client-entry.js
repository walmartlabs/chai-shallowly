require("babel-polyfill");

var srcReq = require.context("src", true, /\.jsx?$/);
srcReq.keys().map(srcReq);
var context = require.context('test', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);