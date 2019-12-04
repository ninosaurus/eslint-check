"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXTENSIONS_TO_LINT = exports.CHECK_NAME = void 0;
const CHECK_NAME = 'ESLint check';
exports.CHECK_NAME = CHECK_NAME;
const EXTENSIONS_TO_LINT = new Set(['.mjs', '.js', '.ts', '.jsx', '.tsx']);
exports.EXTENSIONS_TO_LINT = EXTENSIONS_TO_LINT;