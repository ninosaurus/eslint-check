"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var process = require('process');

var cp = require('child_process');

var path = require('path');

var wait = require('./wait');

test('throws invalid number', function _callee() {
  return _regenerator.default.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regenerator.default.awrap(expect(wait('foo')).rejects.toThrow('milleseconds not a number'));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
test('wait 500 ms', function _callee2() {
  var start, end, delta;
  return _regenerator.default.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          start = new Date();
          _context2.next = 3;
          return _regenerator.default.awrap(wait(500));

        case 3:
          end = new Date();
          delta = Math.abs(end - start);
          expect(delta).toBeGreaterThan(450);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // shows how the runner will run a javascript action with env / stdout protocol

test('test runs', function () {
  process.env['INPUT_MILLISECONDS'] = 500;
  var ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync("node ".concat(ip)).toString());
});