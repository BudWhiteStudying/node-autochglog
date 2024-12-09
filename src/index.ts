import { getGitLogInfo } from './logic/git-parser';
import { organizeCommitsByCategory, organizeCommitsByTags } from './logic/util';
import { FALLBACK_ERROR_MESSAGE } from './messages';

const main = async () => {
  try {
    const gitLogInfo = await getGitLogInfo('develop');
    console.log(
      `By category:\n${JSON.stringify(organizeCommitsByCategory(gitLogInfo), null, 4)}`
    );
    console.log(
      `By tag:\n${JSON.stringify(organizeCommitsByTags(gitLogInfo), null, 4)}`
    );
  } catch (error) {
    try {
      const parsedError = error as { message: string };
      console.warn(parsedError.message || FALLBACK_ERROR_MESSAGE);
    } catch (parsingError) {
      console.warn(`Could not parse error: ${parsingError}`);
      console.error(JSON.stringify(error) || FALLBACK_ERROR_MESSAGE);
    }
  }
};

main();
