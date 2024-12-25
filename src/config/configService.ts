import { join } from 'path';
import { NodeAutoChglogConfig } from './NodeAutochglogConfig';

export const getRuntimeConfig: () => NodeAutoChglogConfig = () => {
  // check for custom config
  // merge it with the default config, if necessary
  // return the config
  return defaultConfig;
};

const defaultConfig: NodeAutoChglogConfig = {
  tagFilter:
    '^\\d+\\.\\d+\\.\\d+(?:-[\\da-zA-Z\\-\\.]+)?(?:\\+[\\da-zA-Z\\-\\.]+)?$',
  initialTag: 'Unreleased',
  templateLocation: join(__dirname, 'DEFAULT_TEMPLATE.mustache'),
  targetBranch: 'develop',
  outputFilepath: join(process.cwd(), 'CHANGELOG.md'),
  allowedCategories: [
    {
      key: 'feat',
      label: 'Features'
    },
    {
      key: 'refactor',
      label: 'Refactoring'
    },
    {
      key: 'chore',
      label: 'Chores'
    },
    {
      key: 'fix',
      label: 'Fixes'
    }
  ]
};
