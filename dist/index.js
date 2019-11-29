"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var request = require('./request');

var _process$env = process.env,
    GITHUB_SHA = _process$env.GITHUB_SHA,
    GITHUB_EVENT_PATH = _process$env.GITHUB_EVENT_PATH,
    GITHUB_TOKEN = _process$env.GITHUB_TOKEN,
    GITHUB_WORKSPACE = _process$env.GITHUB_WORKSPACE; // eslint-disable-next-line import/no-dynamic-require

var event = require(GITHUB_EVENT_PATH);

var repository = event.repository;
var owner = repository.owner.login;
var repo = repository.name;
var checkName = 'ESLint check';
var headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: "Bearer ".concat(GITHUB_TOKEN),
  'User-Agent': 'eslint-action'
};

function createCheck() {
  var body, _ref, data, id;

  return _regenerator.default.async(function createCheck$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          body = {
            name: checkName,
            head_sha: GITHUB_SHA,
            status: 'in_progress',
            started_at: new Date()
          };
          _context.next = 3;
          return _regenerator.default.awrap(request("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/check-runs"), {
            method: 'POST',
            headers: headers,
            body: body
          }));

        case 3:
          _ref = _context.sent;
          data = _ref.data;
          id = data.id;
          return _context.abrupt("return", id);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function eslint() {
  // eslint-disable-next-line global-require
  var eslint = require('eslint');

  var cli = new eslint.CLIEngine({
    extensions: ['.js', '.jsx', '.tsx'],
    ignorePath: ".gitignore"
  });
  var report = cli.executeOnFiles(['.']); // fixableErrorCount, fixableWarningCount are available too

  var results = report.results,
      errorCount = report.errorCount,
      warningCount = report.warningCount;
  var levels = ['', 'warning', 'failure'];
  var annotations = []; // eslint-disable-next-line no-restricted-syntax

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var result = _step.value;
      var filePath = result.filePath,
          messages = result.messages;
      var path = filePath.substring(GITHUB_WORKSPACE.length + 1); // eslint-disable-next-line no-restricted-syntax

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var msg = _step2.value;
          var line = msg.line,
              severity = msg.severity,
              ruleId = msg.ruleId,
              message = msg.message;
          var annotationLevel = levels[severity];
          annotations.push({
            path: path,
            start_line: line,
            end_line: line,
            annotation_level: annotationLevel,
            message: "[".concat(ruleId, "] ").concat(message)
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    conclusion: errorCount > 0 ? 'failure' : 'success',
    output: {
      title: checkName,
      summary: "".concat(errorCount, " error(s), ").concat(warningCount, " warning(s) found"),
      annotations: annotations
    }
  };
}

function updateCheck(id, conclusion, output) {
  var body;
  return _regenerator.default.async(function updateCheck$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          body = {
            name: checkName,
            head_sha: GITHUB_SHA,
            status: 'completed',
            completed_at: new Date(),
            conclusion: conclusion,
            output: output
          };
          _context2.next = 3;
          return _regenerator.default.awrap(request("https://api.github.com/repos/".concat(owner, "/").concat(repo, "/check-runs/").concat(id), {
            method: 'PATCH',
            headers: headers,
            body: body
          }));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function exitWithError(err) {
  console.error('Error', err.stack);

  if (err.data) {
    console.error(err.data);
  }

  process.exit(1);
}

function run() {
  var ms, id, _eslint, conclusion, output;

  return _regenerator.default.async(function run$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          ms = core.getInput('milliseconds');
          _context3.next = 3;
          return _regenerator.default.awrap(createCheck());

        case 3:
          id = _context3.sent;
          _context3.prev = 4;
          _eslint = eslint(), conclusion = _eslint.conclusion, output = _eslint.output;
          console.log(output.summary);
          _context3.next = 9;
          return _regenerator.default.awrap(updateCheck(id, conclusion, output));

        case 9:
          if (conclusion === 'failure') {
            process.exit(78);
          }

          _context3.next = 17;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](4);
          _context3.next = 16;
          return _regenerator.default.awrap(updateCheck(id, 'failure'));

        case 16:
          exitWithError(_context3.t0);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

run().catch(exitWithError);