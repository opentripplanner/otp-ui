import { getStoryContext, TestContext, waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { Page } from 'playwright-core'
import parameters from './previewParameters';

const ONLY_RUN = process.env.ONLY_RUN

async function runSnapshots(page: Page, context: TestContext) {
  const storyContext = await getStoryContext(page, context);
  if (storyContext.parameters?.storyshots?.disable) {
    return;
  }
  await waitForPageReady(page);
  const elementHandler = await page.$('#storybook-root');
  const innerHTML = await elementHandler?.innerHTML();
  expect(innerHTML).toMatchSnapshot();
}

async function runA11yTest(page: Page, context: TestContext) {
  // Get the entire context of a story, including parameters, args, argTypes, etc.
  const storyContext = await getStoryContext(page, context);

  const globalOverrides = parameters.a11y
  // Apply story-level a11y rules
  await configureAxe(page, {
    rules: [...storyContext.parameters?.a11y?.config?.rules, ...globalOverrides.config.rules],
  });
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
    if (!ONLY_RUN || ONLY_RUN === "SNAPSHOTS") {
      await runSnapshots(page, context);
    }
    if (!ONLY_RUN || ONLY_RUN === "A11Y") {
      await runA11yTest(page, context);
    }
  },
};

export default config;