import initStoryshots from "@storybook/addon-storyshots";
import "jest-styled-components";
import { axeTest } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

initStoryshots({
  suite: "A11y checks",
  test: axeTest({
    storybookUrl: `file://${path.resolve(__dirname, "./storybook-static")}`
  })
});
