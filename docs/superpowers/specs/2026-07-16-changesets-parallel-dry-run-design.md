# Changesets Parallel Dry-Run POC Design

## Purpose

Trial Changesets alongside the existing semantic-release automation so the team can learn its authoring, version planning, changelog, and internal-dependency behavior without publishing packages, creating tags, or changing the production release path.

## Scope

- Keep semantic-release as the only production publisher and tag creator.
- Require a Changeset for pull requests that modify publishable workspace packages.
- Permit an explicit empty Changeset for documentation, tooling, and other no-release work.
- Create or update a regular, review-only Changesets version PR for every configured release branch: `master`, `alpha`, `beta`, `next`, `next-major`, and supported maintenance branches.
- Do not merge a trial version PR during the POC.
- Use Changesets' internal dependency propagation to include regular and peer workspace consumers when an internal dependency is released.

## Non-goals

- Publishing packages to npm, including snapshot or prerelease packages.
- Creating Git tags, GitHub releases, or release artifacts from Changesets.
- Replacing semantic-release, Lerna, or the existing branch release model.
- Adding release-plan artifacts, automated comparisons, or other reporting beyond the release PR itself.

## Configuration

Add `@changesets/cli` and the standard `.changeset` directory. Configure independent package releases with public access and no automated commit behavior.

The configuration must include:

```json
{
  "updateInternalDependencies": "patch",
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "updateInternalDependents": "always"
  }
}
```

`updateInternalDependents: "always"` causes Changesets to add regular and peer workspace dependents to the release plan with a patch bump, even when their existing range still satisfies the changed dependency. `updateInternalDependencies: "patch"` then refreshes their dependency ranges, preserving `workspace:` protocol prefixes. This may cascade through transitive workspace consumers, which is intentional for the POC.

Do not enable `bumpVersionsWithWorkspaceProtocolOnly`; the POC should track both workspace-protocol and normal internal dependency declarations. Leave peer-dependent range rewriting at its default behavior so compatible peer dependency ranges are refreshed.

Because this uses an experimental Changesets option, pin the Changesets CLI version and review its release notes before upgrades.

## Pull Request Validation

Add a pull-request workflow that determines whether a change affects publishable workspace packages and runs Changesets validation. A missing Changeset fails the check. An empty Changeset is the explicit opt-out for changes that should not produce a release.

The validation runs on all pull requests targeting a release branch. It does not publish, create tags, or modify the branch.

## Review-Only Version PR Workflow

Add a separate GitHub Actions workflow triggered by pushes to each release branch. It installs dependencies and runs `changesets/action` in version-PR-only mode:

- Configure the action with a GitHub token so it can create or update its release PR.
- Omit the action's `publish` input.
- Do not provide npm credentials or a publish command.
- Do not run `changeset publish`, `changeset git-tag`, or equivalent release commands.
- Use workflow concurrency per branch to prevent simultaneous updates to the same release PR.

The resulting PR is the sole team-facing POC artifact. It contains the proposed package version changes, generated changelog entries, and propagated internal dependency updates. It remains unmerged while semantic-release continues releasing from the branch normally.

## Safety Properties

The POC is non-publishing by construction:

1. The production semantic-release job remains unchanged.
2. The Changesets workflow has no publish command, npm token, or tag-creation command.
3. Trial release PRs are never merged.
4. No Changesets git tags or GitHub releases are created.

## Verification

Before enabling the POC, validate:

1. A feature PR changing a publishable package without a Changeset fails CI.
2. An explicitly empty Changeset permits no-release work.
3. A Changeset affecting an internal package generates a version PR on each supported release branch after merge.
4. The version PR includes expected changelog and package version changes.
5. A regular and a peer workspace consumer are patch-bumped and their dependency ranges refreshed when their dependency is released.
6. The Changesets workflow does not publish, tag, or create a GitHub release.
7. semantic-release continues to complete its existing production release unchanged.

## Exit Criteria

After the team has reviewed multiple unmerged version PRs across the supported release branches, it will decide whether Changesets is sufficiently understandable and aligned with semantic-release to plan a migration.
