import { addons } from '@storybook/addons';

addons.setConfig({
  sidebar: {
    // This prevents showing "roots" or headings for certain stories that have
    // nested hierarchies.
    // See https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#roots
    showRoots: false
  }
})