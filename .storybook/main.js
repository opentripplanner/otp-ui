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
        include: ['hoist-non-react-statics']
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