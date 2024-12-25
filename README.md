# Node Auto-Changelog

> `node-autochglog` is a CLI tool that generates a changelog based on commit messages, assuming that they're written using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) syntax. It is meant to be used in CI/CD pipelines, or in pre-commit hooks.

## Data model

Here are some concepts to better understand the logic behind the tool:

- to the purpose of this tool, a `Changelog` is a list of `Release` items;
- each `Release` item contains a list of `Category` items;
- each `Category` item contains a list of `Commit items`.

In other words, a _changelog_ is a list of _releases_, each _release_ contains a number of _commits_, that are arranged in _categories_ within the _release_ they belong to.

_Releases_ are defined by git tags, _categories_ are defined by Conventional Commit prefixes of _commit_ messages.

## Installation

For making it available within a project:

```bash
npm install save-dev node-autochglog
```

For making it available globally:

```bash
npm install -g node-autochglog
```

## Usage

Currently, `node-autochglog` is in its earliest version and doesn't really accept any configuration. As a consequence, it is also very easy to use.

Just run the following command in the root of the project you want to generate a changelog for:

```bash
node-autochglog
```

...that's it.

## Configuration

The tool doesn't currently accept any configuration, but it _will_ accept it from a `node-autochglog.config.ts` file exporting an object of type [NodeAutoChglogConfig](./src/config/NodeAutochglogConfig.ts):

```typescript
export interface NodeAutoChglogConfig {
  tagFilter: string;
  initialTag: string;
  templateLocation: string;
  targetBranch: string;
  outputFilepath: string;
  allowedCategories: { key: string; label?: string }[];
}
```

| **Config key** | **Purpose** | **Default** |
|----------------|-------------|-------------|
| `tagFilter`    | RegEx used for determining which tags are considered as versions; tags not matching the regEx will be ignored | `^\\d+\\.\\d+\\.\\d+(?:-[\\da-zA-Z\\-\\.]+)?(?:\\+[\\da-zA-Z\\-\\.]+)?$` (SemVer) |
| `initialTag`   | Fallback "tag" to be used when no tags exist, or for recent commits that do not (yet) fall under a version tag | `Unrelesaed` |
| `templateLocation` | Path to the [Mustache]() template to be used for the changelog; **whatever custom template you provide, it will have to work with the metadata provided by the tool, represented by the [`Changelog`](./src/model/Changelog.ts) interface** | [`DEFAULT_TEMPLATE.mustache`](./src/config/DEFAULT_TEMPLATE.mustache) |
| `targetBranch` | Branch from which the commits shall be read for composing the changelog | `develop` |
| `outputFilepath` | Path where the generated changelog shall be written | Project root |
| `allowedCategories` | List of key/label objects defining which commit prefixes (`key`) shall be considered as valid categories and which labels (`label`) shall be used in order to represent them; the `label` property is optional, if absent the `key` property will be used in its place. | <pre lang="json">{<br/>  `key: 'feat',<br/>  label: 'Features'<br/>},<br/>{<br/>  key: 'refactor',<br/>  label: 'Refactoring'<br/>},<br/>{<br/>  key: 'chore',<br/>  label: 'Chores'<br/>},<br/>{<br/>  key: 'fix',<br/>  label: 'Fixes'<br/>}</pre> |