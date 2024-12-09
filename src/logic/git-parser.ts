import util from 'node:util';
import { FALLBACK_ERROR_MESSAGE } from '../messages';
import { Commit } from '../model/Commit';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

const COMMIT_IDS_PATTERN = '%C(auto)%h';
const COMMIT_DATES_PATTERN = '%ci';
const COMMIT_MESSAGES_PATTERN = '%s';
const COMMIT_DECORATIONS_PATTERN = '%d';

const invokeGitLog = async (targetBranch: string, outputPattern: string) => {
  let commandResult: { stdout: string; stderr: string };
  try {
    commandResult = await exec(
      `git log --oneline --no-merges --pretty=format:'${outputPattern}' ${targetBranch}`
    );
    //console.debug(`Git log command result: ${commandResult.stdout}`)
  } catch (error: unknown) {
    let errorMessage;
    if (typeof error == 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message || FALLBACK_ERROR_MESSAGE;
    }
    throw new Error(errorMessage);
  }
  return commandResult.stdout;
};

const getCommitIds = async (targetBranch: string) => {
  return await invokeGitLog(targetBranch, COMMIT_IDS_PATTERN);
};
const getCommitDates = async (targetBranch: string) => {
  return await invokeGitLog(targetBranch, COMMIT_DATES_PATTERN);
};
const getCommitMessages = async (targetBranch: string) => {
  return await invokeGitLog(targetBranch, COMMIT_MESSAGES_PATTERN);
};
const getCommitDecorations = async (targetBranch: string) => {
  return await invokeGitLog(targetBranch, COMMIT_DECORATIONS_PATTERN);
};

export const getGitLogInfo = async (targetBranch: string) => {
  const commitIds = (await getCommitIds(targetBranch)).split('\n');
  const commitDates = (await getCommitDates(targetBranch)).split('\n');
  const commitMessages = (await getCommitMessages(targetBranch)).split('\n');
  const commitDecorations = (await getCommitDecorations(targetBranch)).split(
    '\n'
  );

  const response: Commit[] = [];

  Array.from({ length: commitIds.length }).forEach((_, i) => {
    if (new RegExp('.*: .*').test(commitMessages[i])) {
      response.push({
        id: commitIds[i],
        date: new Date(commitDates[i]),
        message: commitMessages[i]
          .matchAll(/.*:(.*)/g)
          .next()
          .value![1].trim(),
        category: commitMessages[i].matchAll(/(.*):/g).next().value![1],
        decorations: commitDecorations[i]
          ? commitDecorations[i]
              .matchAll(/\((.*)\)/g)
              .next()
              .value![1].split(',')
              .filter((decoration) => decoration.includes('tag: '))
              .map((decoration) =>
                decoration
                  .matchAll(/tag: (.*)/g)
                  .next()
                  .value![1].trim()
              )
          : []
      });
    }
  });
  return response;
};
