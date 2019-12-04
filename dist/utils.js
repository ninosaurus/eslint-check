"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exitWithError = exports.isFileOk = void 0;

var _fs = require("fs");

var core = _interopRequireWildcard(require("@actions/core"));

const isFileOk = path => {
  try {
    if ((0, _fs.existsSync)(path)) {
      // console.log(`Path: ${path} is valid`);
      return true;
    }
  } catch (err) {
    console.error(err);
  } // console.log(`Path: ${path} is not valid`);


  return false;
};

exports.isFileOk = isFileOk;

const exitWithError = err => {
  console.error('Error', err.stack);

  if (err.data) {
    console.error(err.data);
  }

  core.setFailed(err.message);
};

exports.exitWithError = exitWithError;