import { reactIntl } from './react-intl.ts';

const parameters = {
  a11y: {
    config: {
      rules: [
        {
          //  moved to technical backlog
          id: "aria-required-parent",
          reviewOnFail: true,
        },
        {
          // Appears to be a story bug
          id: "duplicate-id",
          reviewOnFail: true
        },
        {
          // Appears to be a story bug
          id: "duplicate-id-aria",
          reviewOnFail: true
        },
        {
          // Not really applicable to stories and causes problems with the WithMap decorator
          id: "landmark-unique", 
          enabled: false
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
  reactIntl
};

export default parameters;