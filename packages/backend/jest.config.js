module.exports = {
  // Configuración para módulos ES6
  preset: '@babel/preset-env',
  testEnvironment: 'node',
  
  // Transformaciones
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Patrones de archivos de test
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup antes de todos los tests
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
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
  
  // Timeout para tests (importante para concurrencia)
  testTimeout: 30000,
  
  // Configuración específica para concurrencia
  maxConcurrency: 1, // Tests de concurrencia deben ejecutarse en serie
  
  // Reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-results',
      filename: 'report.html'
    }]
  ],
  
  // Configuración para tests específicos
  projects: [
    {
      displayName: 'Concurrencia',
      testMatch: ['**/__tests__/concurrencia.test.js'],
      maxConcurrency: 1
    },
    {
      displayName: 'HTTP',
      testMatch: ['**/__tests__/http.test.js']
    },
    {
      displayName: 'Unit',
      testMatch: ['**/__tests__/*.test.js'],
      testPathIgnorePatterns: [
        '**/__tests__/concurrencia.test.js',
        '**/__tests__/http.test.js'
      ]
    }
  ]
};