import minimist from 'minimist';
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { build } from './rollup.config.js';
import { setEnv } from './env.js';
import shell from 'shelljs';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const getAllPkgConfigs = () => {
  const bundleTypes = ['cjs', 'es'];
  const packages = readdirSync(resolve(__dirname, '../packages/')).filter(item => /^([^.]+)$/.test(item));

  const allPkgConfigs = [];
  packages.forEach(directoryName => {
    const pkgPath = resolve(__dirname, '../packages/', directoryName);
    const { name: pkgName, private: isPrivate } = JSON.parse(readFileSync(resolve(pkgPath, 'package.json'), 'utf-8'));

    if (!isPrivate) {
      bundleTypes.forEach(bundleType => {
        const inputPath = resolve(pkgPath, './src');
        const inputFile = resolve(pkgPath, './src/index.ts');
        const outputPath = resolve(pkgPath, './dist');
        const outputFile = resolve(pkgPath, `./dist/index.${bundleType}.js`);
        const tsconfig = resolve(pkgPath, './tsconfig.json');
        allPkgConfigs.push({
          directoryName,
          pkgPath,
          pkgName,
          inputPath,
          inputFile,
          outputPath,
          outputFile,
          tsconfig,
          bundleType,
        });
      });
    }
  });
  return allPkgConfigs;
};

const allPkgConfigs = getAllPkgConfigs();

const { env, endshell, watch } = args;
const isWatch = !!watch;
setEnv(env);

const onAllBuildEnd = () => {
  if (endshell) {
    shell.exec(endshell, { async: true });
  }
};

if (args.p) {
  const pkgNames = args.p.split(',');
  const filterPkgConfigs = allPkgConfigs.filter(pkgConfig => {
    return pkgNames.indexOf(pkgConfig.directoryName) !== -1 || pkgNames.indexOf(pkgConfig.pkgName) !== -1;
  });
  if (filterPkgConfigs.length > 0) {
    build(filterPkgConfigs, isWatch, onAllBuildEnd);
  } else {
    console.error(`${args.p} Does not exist!`);
  }
} else {
  build(allPkgConfigs, isWatch, onAllBuildEnd);
}
