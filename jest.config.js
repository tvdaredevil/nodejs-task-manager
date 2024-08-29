module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/server/src/**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/server/src/$1",
  },
};
