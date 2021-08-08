module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['#helpers', './helpers'],
          ['#models', './models'],
          ['^#config$', './configuration/config.js'],
          ['#config', './configuration'],
        ],
      },
    },
  },
};
