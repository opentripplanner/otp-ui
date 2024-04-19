import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';
import { Page } from 'playwright-core'

const ONLY_RUN = process.env.ONLY_RUN

async function runSnapshots(page: Page) {
  const elementHandler = await page.$('#storybook-root');
  const innerHTML = await elementHandler?.innerHTML();
  expect(innerHTML).toMatchSnapshot();
}

async function runA11yTest(page: Page) {
  await checkA11y(page, '#storybook-root', {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    await new Promise((resolve) => setTimeout(resolve, 3000));
    if (!ONLY_RUN || ONLY_RUN === "SNAPSHOTS") {
      await runSnapshots(page);
    }
    if (!ONLY_RUN || ONLY_RUN === "A11Y") {
      await runA11yTest(page);
    }
  },
};

export default config;