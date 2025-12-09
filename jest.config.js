module.exports = {
  cacheDirectory: ".jest-cache",
  coverageDirectory: ".jest-coverage",
  coveragePathIgnorePatterns: ["<rootDir>/packages/(?:.+?)/dist/"],
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
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
    "yml",
    "yaml"
  ],
  moduleNameMapper: {
    "\\.(s?css|less)$": "identity-obj-proxy",
    "\\.(pbf)$": "<rootDir>/__mocks__/file-mock.js",
    "\\.(svg)$": "<rootDir>/__mocks__/file-mock.js"
  },
  modulePathIgnorePatterns: ["<rootDir>/packages/.*/dist/"],
  testPathIgnorePatterns: ["<rootDir>/packages/.*/dist/", "a11y", "\\.d\\.ts"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.ya?ml$": "yaml-jest",
    "\\.graphql$": "jest-file-loader"
  },
  transformIgnorePatterns: ["/node_modules/(?!(chroma-js)/)"]
};
