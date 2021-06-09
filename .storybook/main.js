const path = require("path");

module.exports = {
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-docs",
    "@storybook/addon-essentials",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
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
    "@storybook/addon-viewport"
  ],
  "stories": [
    "../packages/**/*.story.mdx",
    "../packages/**/*.story.@(js|jsx|ts|tsx)"
  ]
}