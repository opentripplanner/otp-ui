module.exports = {
  cacheDirectory: ".jest-cache",
  coverageDirectory: ".jest-coverage",
  coveragePathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/lib/"],
  coverageReporters: ["html", "text"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  globalSetup: "<rootDir>/test-utils/global-setup.js",
  moduleNameMapper: {
    "\\.(s?css|less)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/file-mock.js"
  },
  testPathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/(esm|lib)/"]
};
