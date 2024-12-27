module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/cdk','<rootDir>/lambdas'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
