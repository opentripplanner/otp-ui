import { dirname, join } from "path";
const path = require("path");

module.exports = {
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-links"),
    "storybook-react-intl",
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel")
  ],

  stories: [
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

    // Add fallback for querystring
    config.resolve.fallback = {
      ...config.resolve.fallback,
      querystring: require.resolve('querystring-es3')
    };

    // Configure module resolution for workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentripplanner': path.resolve(__dirname, '../packages')
    };

    // Return the altered config
    return config;
  },

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}