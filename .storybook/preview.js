
import { setupWorker } from "msw";
import handlers from "../packages/location-field/src/mocks/handlers";

// Only install worker when running in browser
if (typeof global.process === 'undefined') {
  const worker = setupWorker(...handlers);
  worker.start()
}


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}