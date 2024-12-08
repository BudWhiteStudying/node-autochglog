import { getGitLogInfo } from './logic/git-parser';
import { FALLBACK_ERROR_MESSAGE } from './messages';

const main = async () => {
  try {
    const gitLogInfo = await getGitLogInfo('develop');
    console.log(JSON.stringify(gitLogInfo, null, 4));
  } catch (error: any) {
    console.warn('caught..?');
    try {
      const parsedError = error as { message: string };
      console.warn(parsedError.message || FALLBACK_ERROR_MESSAGE);
    } catch (parsingError: any) {
      console.error(JSON.stringify(error) || FALLBACK_ERROR_MESSAGE);
    }
  }
};

main();
