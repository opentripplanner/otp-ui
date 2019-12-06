module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "babel-plugin-styled-components"
  ],
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-react"
  ]
};
