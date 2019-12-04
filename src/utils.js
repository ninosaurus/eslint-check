import { existsSync } from 'fs';
import * as core from '@actions/core';

export const isFileOk = (path) => {
  try {
    if (existsSync(path)) {
      // console.log(`Path: ${path} is valid`);
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  // console.log(`Path: ${path} is not valid`);

  return false;
};

export const exitWithError = (err) => {
  console.error('Error', err.stack);
  if (err.data) {
    console.error(err.data);
  }
  core.setFailed(err.message);
};
