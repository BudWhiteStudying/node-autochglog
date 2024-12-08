import { exec } from 'child_process';

const targetBranch = 'develop';

const command = `git log --oneline --no-merges --pretty=format:'%C(auto)%h%d %cs %s' main..${targetBranch}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`Standard Output: ${stdout}`);
  console.error(`Standard Error: ${stderr}`);
});