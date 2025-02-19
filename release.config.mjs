/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  fail: [],
  extends: "semantic-release-monorepo",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@anolilab/semantic-release-pnpm",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
  repositoryUrl: "https://github.com/opentripplanner/otp-ui.git",
  success: []
};
