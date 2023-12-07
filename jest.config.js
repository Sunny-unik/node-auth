/** @type {import('jest').Config} */

const testsDir = '<rootDir>/tests/';
const config = {
  modulePaths: [testsDir],
  watchPathIgnorePatterns: [testsDir],
};

export default config;
