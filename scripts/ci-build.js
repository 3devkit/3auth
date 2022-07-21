import shell from 'shelljs';

const changeRes = shell.exec(`yarn lerna changed `, {
  silent: true,
});
const array = changeRes.split('\n');
const packages = array.filter(line => line.startsWith('@3devkit/'));
if (packages.length <= 0) {
  console.log('无需编译!');
} else {
  const buildPacakges = packages.join(',');
  console.log('need-build-package: ', buildPacakges);
  // if (shell.exec(`yarn build -p ${buildPacakges}`).code !== 0) {
  if (shell.exec(`yarn build`).code !== 0) {
    throw new Error('Build failed');
  }
}
