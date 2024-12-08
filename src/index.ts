import { getGitLogInfo } from './logic/git-parser';
import { FALLBACK_ERROR_MESSAGE } from './messages';

const main = async () => {
  try {
    const gitLogInfo = await getGitLogInfo('develop');
    console.log(JSON.stringify(gitLogInfo, null, 4));
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
