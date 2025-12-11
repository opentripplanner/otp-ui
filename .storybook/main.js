import { dirname, join } from "path";
import { mergeConfig } from "vite";
import ViteYaml from '@modyfi/vite-plugin-yaml';
import graphqlLoader from 'vite-plugin-graphql-loader';
import react from '@vitejs/plugin-react';
import path from "path";

export default {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "storybook-react-intl",
  ],

  core: {
    builder: '@storybook/builder-vite',
  },

  stories: [
    "../packages/*/src/**/*.story.@(js|jsx|ts|tsx)"
  ],

  staticDirs: ['../public'],

  async viteFinal(config, { configType }) {
    // This method is for altering Storybook's Vite configuration.
    return mergeConfig(config, {
      plugins: [
        // Configure React plugin with Babel for styled-components displayName
        react({
          babel: {
            plugins: [
              [
                'babel-plugin-styled-components',
                {
                  displayName: true,
                  fileName: true
                }
              ]
            ]
          }
        }),
        // Add support for importing YAML files
        ViteYaml(),
        // Add support for importing GraphQL files
        graphqlLoader(),
      ],
      build: {
        rollupOptions: {
          plugins: []
        }
      },
      
      assetsInclude: [
        // Add support for importing image files
        '**/*.png',
        '**/*.jpg',
        '**/*.gif',
        '**/*.svg'
      ],

      // Add fallback for querystring
      define: {
        global: 'globalThis',
      },

      optimizeDeps: {
        include: ['hoist-non-react-statics'],
        exclude: [
          '@opentripplanner/base-map',
          '@opentripplanner/building-blocks',
          '@opentripplanner/core-utils',
          '@opentripplanner/endpoints-overlay',
          '@opentripplanner/from-to-location-picker',
          '@opentripplanner/geocoder',
          '@opentripplanner/humanize-distance',
          '@opentripplanner/icons',
          '@opentripplanner/itinerary-body',
          '@opentripplanner/location-field',
          '@opentripplanner/location-icon',
          '@opentripplanner/map-popup',
          '@opentripplanner/otp2-tile-overlay',
          '@opentripplanner/park-and-ride-overlay',
          '@opentripplanner/printable-itinerary',
          '@opentripplanner/route-viewer-overlay',
          '@opentripplanner/scripts',
          '@opentripplanner/stop-viewer-overlay',
          '@opentripplanner/stops-overlay',
          '@opentripplanner/transit-vehicle-overlay',
          '@opentripplanner/transitive-overlay',
          '@opentripplanner/trip-details',
          '@opentripplanner/trip-form',
          '@opentripplanner/trip-viewer-overlay',
          '@opentripplanner/types',
          '@opentripplanner/vehicle-rental-overlay',
          '@opentripplanner/zoom-based-markers',
        ]
      },

      resolve: {
        alias: {
          querystring: 'querystring-es3'
        }
      },
    });
  },

  framework: {
    name: "@storybook/react-vite",
    options: {}
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
}