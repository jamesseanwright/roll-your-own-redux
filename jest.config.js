'use strict';

module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "src(\/.*)?\/__tests__\/.*\.test\.tsx?$",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  setupTestFrameworkScriptFile: './testSupport/setupEnzyme',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    }
  },
};
