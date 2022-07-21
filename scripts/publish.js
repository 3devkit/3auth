import minimist from 'minimist';
import shell from 'shelljs';

const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
if (args.p) {
  shell.exec(`node scripts/build.js -p ${args.p}`, { async: false });
  shell.exec(`cd packages/${args.p} && npm version patch && npm publish`, {
    async: false,
  });
  shell.exec(`git add .`, {
    async: false,
  });
} else {
  console.info('缺少参数');
}
