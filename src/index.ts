#!/usr/bin/env node

import 'source-map-support/register';

import { defaultConfig } from './config/NodeAutochglogConfig';
import { getGitLogInfo } from './logic/git-parser';
import {
  buildChangelogMetadata,
  organizeCommitsByTagsAndCategories
} from './logic/util';
import { FALLBACK_ERROR_MESSAGE } from './messages';

import fs from 'fs';
import Mustache from 'mustache';

const main = async () => {
  try {
    const gitLogInfo = await getGitLogInfo(defaultConfig.targetBranch);
    fs.writeFileSync(
      defaultConfig.outputFilepath,
      Mustache.render(
        fs.readFileSync(defaultConfig.templateLocation, 'utf-8'),
        buildChangelogMetadata(
          organizeCommitsByTagsAndCategories(gitLogInfo),
          gitLogInfo.tags
        )
      )
    );
    console.info(`DONE! Output written to ${defaultConfig.outputFilepath}`);
  } catch (error) {
    try {
      const parsedError = error as { message: string };
      console.warn(parsedError.message || FALLBACK_ERROR_MESSAGE);
    } catch (parsingError) {
      console.warn(`Could not parse error: ${parsingError}`);
      console.error(JSON.stringify(error) || FALLBACK_ERROR_MESSAGE);
    }
    throw error;
  }
};

main();
