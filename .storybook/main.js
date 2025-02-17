import { dirname, join } from "path";
const path = require("path");

module.exports = {
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-controls"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-links"),
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          // test: [/\.stories\.jsx?$/], This is default
          include: [path.resolve(__dirname, './src')],
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: false },
        }
      }
    },
    getAbsolutePath("@storybook/addon-viewport"),
    "@danielhep/storybook-react-intl"
  ],

  stories: [
    "../packages/**/*.story.mdx",
    "../packages/*/src/**/*.story.@(js|jsx|ts|tsx)"
  ],
  staticDirs: ['../public'],

  webpackFinal: async (config, { configType }) => {
    // This method is for altering Storybook's webpack configuration.
    // Add support for importing image files
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
        },
      ],
      include: path.resolve(__dirname, './packages/transitive-overlay/src/images'),
    });
    // Add support for importing YAML files.
    config.module.rules.push({
      test: /\.(yml|yaml)$/,
      loader: "yaml-loader"
    });

    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    config.module.rules.push({
      test: /uFuzzy/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', { targets: 'defaults' }]
        ]
      }
    })

    // Return the altered config
    return config;
  },

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },

  docs: {
    autodocs: true
  }
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}