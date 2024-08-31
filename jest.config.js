module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    reporters: [
        'default',
        ["jest-html-reporters", {
            "publicPath": "coverage/html-report",
            "filename": "report.html",
            "openReport": true
        }]
    ],
};