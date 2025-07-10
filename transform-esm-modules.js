import babelJest from "babel-jest";

export default babelJest.default.createTransformer({
  presets: [["@babel/preset-env", { targets: { node: "current" } }]]
});
