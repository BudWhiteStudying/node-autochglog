import util from 'node:util';
import { FALLBACK_ERROR_MESSAGE } from '../messages';
import { Commit } from '../model/Commit';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

const COMMIT_IDS_PATTERN = '%C(auto)%h';
const COMMIT_DATES_PATTERN = '%cs';
const COMMIT_MESSAGES_PATTERN = '%s';

const invokeGitLog = async (targetBranch: string, outputPattern: string) => {
  let commandResult: { stdout: string; stderr: string };
  try {
    commandResult = await exec(
      `git log --oneline --no-merges --pretty=format:'${outputPattern}' ${targetBranch}`
    );
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

export const getGitLogInfo = async (targetBranch: string) => {
  const commitIds = (await getCommitIds(targetBranch)).split('\n');
  const commitDates = (await getCommitDates(targetBranch)).split('\n');
  const commitMessages = (await getCommitMessages(targetBranch)).split('\n');

  const response: Commit[] = [];

  Array.from({ length: commitIds.length }).forEach((_, i) => {
    response.push({
      id: commitIds[i],
      date: commitDates[i],
      message: commitMessages[i],
      category: commitMessages[i].matchAll(/(.*):/g).next().value![1]
    });
  });

  return response;
};
