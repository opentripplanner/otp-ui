const path = require('path');

const excludePaths = [/node_modules/, /dist/]

module.exports = function({ config }) {
  config.module.rules.push({
    test: /.story.js$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  config.resolve.alias = {
    '#': path.resolve(__dirname, '../packages')
  };

  // HACK: extend existing JS rule to ensure all dependencies are correctly ignored
  // https://github.com/storybooks/storybook/issues/3346#issuecomment-459439438
  const jsRule = config.module.rules.find((rule) => rule.test.test('.jsx'))
  jsRule.exclude = excludePaths

  // HACK: Instruct Babel to check module type before injecting Core JS polyfills
  // https://github.com/i-like-robots/broken-webpack-bundle-test-case
  // See also https://github.com/storybookjs/storybook/issues/3346#issuecomment-554270012
  const babelConfig = jsRule.use.find(({ loader }) => loader === 'babel-loader')
  babelConfig.options.sourceType = 'unambiguous'

  return config;
};
