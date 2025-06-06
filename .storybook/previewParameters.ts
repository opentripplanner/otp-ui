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
        },
        {
          // FIXME: Send a PR to maplibre-gl 5.x to not populate aria-label on <div> elements.
          // This occurs in their source code at https://github.com/maplibre/maplibre-gl-js/blob/b450876c1707ad7fc563a86b37a472578b4545dc/src/ui/marker.ts#L319.
          id: "aria-prohibited-attr",
          selector: "*:not(div.maplibregl-marker)"
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