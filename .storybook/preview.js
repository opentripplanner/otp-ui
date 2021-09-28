import { setupWorker } from "msw";
import handlers from "../packages/location-field/src/mocks/handlers";

// Only install worker when running in browser
if (typeof global.process === 'undefined') {
  const worker = setupWorker(...handlers);
  worker.start({onUnhandledRequest: "bypass"})
}


export const parameters = {
  a11y: {
    config: {
      rules: [
        {
          //  moved to technical backlog
          id: 'aria-required-parent',
          reviewOnFail: true,
        },
        {
          // Appears to be a story bug
          id: 'duplicate-id',
          reviewOnFail: true
        },
        {
          // Appears to be a story bug
          id: 'duplicate-id-aria',
          reviewOnFail: true
        }
      ],
    },
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}