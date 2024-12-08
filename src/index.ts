import { getGitLog } from "./git-parser";

const main = async () => {
    try {
        await getGitLog('develop');
    }
    catch(error : any) {
        console.warn('caught..?')
        try {
            const parsedError = error as {message : string};
            console.warn(parsedError.message);
        }
        catch(parsingError : any) {
            console.error(JSON.stringify(error) || 'shite');
        }
    }
};

main();
