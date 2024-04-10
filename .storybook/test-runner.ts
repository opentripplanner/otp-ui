import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';
import fs from 'fs'

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler?.innerHTML();
    expect(innerHTML).toMatchSnapshot();
    // const violations = await getViolations(page, '#storybook-root', {
    //   reporter: 'html'
    // });
  
    // Do something with violations
    // For example, write them to a file
    // if(violations.length > 0) {
    //   await new Promise<void>((resolve, reject) => {
    //     fs.writeFile(
    //       process.cwd() + `/results/${context.id}.json`,
    //       JSON.stringify(violations, null, 2),
    //       (err) => {
    //         if (err) reject(err);
    //         resolve();
    //       }
    //       );
    //   });
    // }
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};

export default config;