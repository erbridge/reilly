module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  transformIgnorePatterns: [],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!**/*.d.ts"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
