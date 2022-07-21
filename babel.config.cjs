// https://jestjs.io/docs/en/getting-started.html#using-babel
// "@babel/plugin-transform-modules-commonjs"
// "babel-plugin-dynamic-import-node",
// "@babel/plugin-proposal-class-properties",

module.exports = {
  presets: [],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
      plugins: [],
    },
  },
};
