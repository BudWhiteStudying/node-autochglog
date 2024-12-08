import util from 'node:util';
const exec = util.promisify(require('child_process').exec);

const FALLBACK_ERROR_MESSAGE = 'No further info available';

const COMMIT_IDS_PATTERN = '%C(auto)%h';
const COMMIT_DATES_PATTERN = '%cs';
const COMMIT_MESSAGES_PATTERN = '%s';

const getGitLog = async (targetBranch : string, outputPattern : string) => {
    let commandResult : {stdout :string, stderr : string};
    try {
        commandResult = await exec(`git log --oneline --no-merges --pretty=format:'${outputPattern}' ${targetBranch}`);
    }
    catch(error : any) {
        const errorMessage = error?.message as string || error.toString() || FALLBACK_ERROR_MESSAGE;
        throw new Error(errorMessage)
    }
    //TODO: do stuff with it
    return commandResult.stdout;
};

const getCommitIds = async (targetBranch : string) => {
    return await getGitLog(targetBranch, COMMIT_IDS_PATTERN);
};
const getCommitDates = async (targetBranch : string) => {
    return await getGitLog(targetBranch, COMMIT_DATES_PATTERN);
};
const getCommitMessages = async (targetBranch : string) => {
    return await getGitLog(targetBranch, COMMIT_MESSAGES_PATTERN);
};

export const getFullGitLog = async (targetBranch : string) => {
    const commitIds = (await getCommitIds(targetBranch)).split('\n');
    const commitDates = (await getCommitDates(targetBranch)).split('\n');
    const commitMessages = (await getCommitMessages(targetBranch)).split('\n');

    const response : {id: string, date: string, message: string}[] = [];

    Array.from({ length: commitIds.length }).forEach((_, i) => {
        response.push(
            {
                id : commitIds[i],
                date : commitDates[i],
                message : commitMessages[i]
            }
        );
      });

      return response;
}