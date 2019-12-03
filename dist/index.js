(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src lazy recursive":
/*!***********************************!*\
  !*** ./src lazy namespace object ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(function() {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src lazy recursive\";\n\n//# sourceURL=webpack:///./src_lazy_namespace_object?");

/***/ }),

/***/ "./src/eslint_cli.js":
/*!***************************!*\
  !*** ./src/eslint_cli.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return eslint; });\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconst getDirectories = source => Object(fs__WEBPACK_IMPORTED_MODULE_1__[\"readdirSync\"])(source, {\n  withFileTypes: true\n}).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);\n\nasync function eslint(files, eslintConfigPath, githubWorkspace, customDirectory) {\n  console.log(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(process.cwd(), customDirectory, 'node_modules/eslint'));\n  console.log({\n    cwd: process.cwd()\n  });\n  const {\n    CLIEngine\n  } = await __webpack_require__(\"./src lazy recursive\")(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(process.cwd(), customDirectory, 'node_modules/eslint')).then(module => {\n    console.log('resolved', module);\n    return module.default;\n  });\n  const cli = new CLIEngine({\n    useEslintrc: false,\n    configFile: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(githubWorkspace, eslintConfigPath),\n    extensions: ['.js', '.jsx', '.tsx']\n  });\n  console.log(files);\n  const report = cli.executeOnFiles(files); // fixableErrorCount, fixableWarningCount are available too\n\n  const {\n    results,\n    errorCount,\n    warningCount\n  } = report;\n  const levels = ['', 'warning', 'failure'];\n  const annotations = []; // eslint-disable-next-line no-restricted-syntax\n\n  for (const result of results) {\n    const {\n      filePath,\n      messages\n    } = result;\n    const path = filePath.substring(githubWorkspace.length + 1); // eslint-disable-next-line no-restricted-syntax\n\n    for (const msg of messages) {\n      const {\n        line,\n        severity,\n        ruleId,\n        message\n      } = msg;\n      const annotationLevel = levels[severity];\n\n      if (!cli.isPathIgnored(filePath)) {\n        annotations.push({\n          path,\n          start_line: line,\n          end_line: line,\n          annotation_level: annotationLevel,\n          message: `[${ruleId}] ${message}`\n        });\n      }\n    }\n  }\n\n  console.log(annotations);\n  return {\n    conclusion: errorCount > 0 ? 'failure' : 'success',\n    output: {\n      // title: checkName,\n      title: 'testic',\n      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,\n      annotations\n    }\n  };\n}\n\n//# sourceURL=webpack:///./src/eslint_cli.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @actions/core */ \"@actions/core\");\n/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var actions_toolkit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! actions-toolkit */ \"actions-toolkit\");\n/* harmony import */ var actions_toolkit__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(actions_toolkit__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _octokit_rest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @octokit/rest */ \"@octokit/rest\");\n/* harmony import */ var _octokit_rest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_octokit_rest__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _eslint_cli__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./eslint_cli */ \"./src/eslint_cli.js\");\n\n\n\n\n\n\n\nconst github = __webpack_require__(/*! @actions/github */ \"@actions/github\");\n\nconst eslintConfigPath = _actions_core__WEBPACK_IMPORTED_MODULE_1__[\"getInput\"]('eslint-config-path', {\n  required: true\n});\nconst repoToken = _actions_core__WEBPACK_IMPORTED_MODULE_1__[\"getInput\"]('repo-token', {\n  required: true\n});\nconst customDirectory = _actions_core__WEBPACK_IMPORTED_MODULE_1__[\"getInput\"]('custom-directory', {\n  required: true\n});\nconst tools = new actions_toolkit__WEBPACK_IMPORTED_MODULE_2__[\"Toolkit\"]();\nconst octokit = new _octokit_rest__WEBPACK_IMPORTED_MODULE_3___default.a({\n  auth: `token ${repoToken}`\n});\n\nconst gql = s => s.join('');\n\nconst {\n  GITHUB_WORKSPACE\n} = process.env;\n\nconst isFileOk = path => {\n  try {\n    if (Object(fs__WEBPACK_IMPORTED_MODULE_4__[\"existsSync\"])(path)) {\n      console.log(`Path: ${path} is valid`);\n      return true;\n    }\n  } catch (err) {\n    console.error(err);\n  }\n\n  console.log(`Path: ${path} is not valid`);\n  return false;\n}; // if (customDirectory) {\n//   const directory = join(process.cwd(), customDirectory);\n//   tools.log.info(`New directory: ${directory}`);\n//   process.chdir(directory);\n//   tools.log.info(getDirectories(process.cwd()));\n// }\n\n\nconst checkName = 'ESLint check';\nconst headers = {\n  'Content-Type': 'application/json',\n  Accept: 'application/vnd.github.antiope-preview+json',\n  Authorization: `Bearer ${repoToken}`,\n  'User-Agent': 'eslint-action'\n};\n\nasync function createCheck() {\n  const {\n    context\n  } = github;\n  const {\n    sha\n  } = context;\n  const {\n    owner,\n    repo\n  } = context.repo;\n  const {\n    data\n  } = await octokit.checks.create({\n    owner,\n    repo,\n    name: 'eslint-check',\n    started_at: new Date(),\n    status: 'in_progress',\n    head_sha: sha\n  });\n  const {\n    id\n  } = data;\n  return id;\n}\n\nasync function updateCheck(id, conclusion, output) {\n  const {\n    context\n  } = github;\n  const {\n    sha\n  } = context;\n  const {\n    owner,\n    repo\n  } = context.repo;\n  await octokit.checks.create({\n    owner,\n    repo,\n    name: 'eslint-check',\n    completed_at: new Date(),\n    status: 'completed',\n    head_sha: sha,\n    conclusion,\n    output\n  });\n}\n\nfunction exitWithError(err) {\n  tools.log.error('Error', err.stack);\n\n  if (err.data) {\n    tools.log.error(err.data);\n  }\n\n  process.exit(1);\n}\n\nasync function run() {\n  tools.log.info(process.env);\n  const id = await createCheck();\n  tools.log.info(`Created check. Id: ${id}`);\n\n  try {\n    const octokit = new github.GitHub(repoToken);\n    const {\n      context\n    } = github;\n    const prInfo = await octokit.graphql(gql`\n      query($owner: String!, $name: String!, $prNumber: Int!) {\n        repository(owner: $owner, name: $name) {\n          pullRequest(number: $prNumber) {\n            files(first: 100) {\n              nodes {\n                path\n              }\n            }\n            commits(last: 1) {\n              nodes {\n                commit {\n                  oid\n                }\n              }\n            }\n          }\n        }\n      }\n    `, {\n      owner: context.repo.owner,\n      name: context.repo.repo,\n      prNumber: context.issue.number\n    }); // const currentSha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;\n    // tools.log.info('Commit from GraphQL:', currentSha);\n\n    const files = prInfo.repository.pullRequest.files.nodes; // tools.log.info(files);\n\n    const EXTENSIONS_TO_LINT = new Set(['.mjs', '.js', '.ts', '.jsx', '.tsx']);\n    const filesToLint = files.filter(file => EXTENSIONS_TO_LINT.has(Object(path__WEBPACK_IMPORTED_MODULE_0__[\"extname\"])(file.path)) && isFileOk(file.path)) // .map((file) => resolve(GITHUB_WORKSPACE, file.path));\n    .map(file => file.path);\n\n    if (filesToLint.length < 1) {\n      tools.log.warn(`No files with [${[...EXTENSIONS_TO_LINT].join(', ')}] extensions added or modified in this PR, nothing to lint...`);\n      return;\n    }\n\n    tools.log.info('Started linting...');\n    const {\n      conclusion,\n      output\n    } = await Object(_eslint_cli__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(filesToLint, eslintConfigPath, GITHUB_WORKSPACE, customDirectory);\n    tools.log.info('Ended linting.');\n    tools.log.info(conclusion, output.summary);\n    await updateCheck(id, conclusion, output);\n\n    if (conclusion === 'failure') {\n      process.exit(78);\n    }\n  } catch (err) {\n    await updateCheck(id, 'failure');\n    exitWithError(err);\n  }\n}\n\nrun().catch(exitWithError);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "@actions/core":
/*!********************************!*\
  !*** external "@actions/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@actions/core\");\n\n//# sourceURL=webpack:///external_%22@actions/core%22?");

/***/ }),

/***/ "@actions/github":
/*!**********************************!*\
  !*** external "@actions/github" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@actions/github\");\n\n//# sourceURL=webpack:///external_%22@actions/github%22?");

/***/ }),

/***/ "@octokit/rest":
/*!********************************!*\
  !*** external "@octokit/rest" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@octokit/rest\");\n\n//# sourceURL=webpack:///external_%22@octokit/rest%22?");

/***/ }),

/***/ "actions-toolkit":
/*!**********************************!*\
  !*** external "actions-toolkit" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"actions-toolkit\");\n\n//# sourceURL=webpack:///external_%22actions-toolkit%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ })));