import { addDecorator } from '@storybook/react';
import {createElement} from 'react';

// Stories that use hooks need to be wrapped in a function to be able
// to be rendered within Storyshot
addDecorator(createElement);

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