import { join } from 'path';

export interface NodeAutoChglogConfig {
  tagFilter: string;
  initialTag: string;
  templateLocation: string;
  targetBranch: string;
  outputFilepath: string;
  allowedCategories: { key: string; label?: string }[];
}

export const defaultConfig: NodeAutoChglogConfig = {
  tagFilter:
    '^\\d+\\.\\d+\\.\\d+(?:-[\\da-zA-Z\\-\\.]+)?(?:\\+[\\da-zA-Z\\-\\.]+)?$',
  initialTag: 'Unreleased',
  templateLocation: join(__dirname, 'src/config/DEFAULT_TEMPLATE.mustache'),
  targetBranch: 'develop',
  outputFilepath: join(__dirname, 'CHANGELOG.md'),
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
