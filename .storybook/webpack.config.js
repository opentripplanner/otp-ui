const path = require('path');

module.exports = function({ config }) {
    config.module.rules.push({
      test: /.story.js$/,
      loaders: [require.resolve('@storybook/addon-storysource/loader')],
      enforce: 'pre',
    });

    config.resolve.alias = {
      '#': path.resolve(__dirname, '../packages')
    };

    return config;
  };
