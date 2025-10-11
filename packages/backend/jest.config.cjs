// jest.config.cjs
module.exports = {
  testEnvironment: 'node',

  // Patrones de archivos de test
  testMatch: [
    '**/test/**/*.test.js',
    '**/test/**/*.spec.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Setup antes de todos los tests
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/ejemplos/**',
    '!src/demo/**'
  ],

  // Thresholds de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Timeout para tests (importante para algunos casos de IO/concurrencia)
  testTimeout: 30000,

  // Reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-results',
      filename: 'report.html'
    }]
  ],

  // Proyectos (suites) específicos
  projects: [
    {
      displayName: 'Concurrencia',
      testMatch: ['**/test/concurrencia.test.js', '**/__tests__/concurrencia.test.js']
      // Si querés correr esta suite en serie: `npx jest --runInBand --selectProjects Concurrencia`
    },
    {
      displayName: 'HTTP',
      testMatch: ['**/test/integration/**/*.test.js', '**/__tests__/integration/**/*.test.js']
    },
    {
      displayName: 'Unit',
      // Enfocamos solo a unit para evitar ignores con regex
      testMatch: ['**/test/unit/**/*.test.js', '**/__tests__/unit/**/*.test.js']
    }
  ]
};
