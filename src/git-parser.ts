import util from 'node:util';
const exec = util.promisify(require('child_process').exec);

const FALLBACK_ERROR_MESSAGE = 'No further info available';

export const getGitLog = async (targetBranch : string) => {
    let commandResult;
    try {
        commandResult = await exec(`git log --oneline --no-merges --pretty=format:'%C(auto)%h%d %cs %s' main..${targetBranch}`);
    }
    catch(error : any) {
        const errorMessage = error?.message as string || error.toString() || FALLBACK_ERROR_MESSAGE;
        throw new Error(errorMessage)
    }
    //TODO: do stuff with it
    return commandResult;
};