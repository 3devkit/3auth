/* eslint-disable @typescript-eslint/no-require-imports */
// https://github.com/cnlinge/jest-js-ts-start
// https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs

import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as url from 'url';

const ES_MODEL_WHITELIST = ['@3devkit', 'lodash-es'];
const EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const createPkgConfigs = () => {
  const moduleNameMapper = {};
  const packages = readdirSync(resolve(__dirname, '../packages/')).filter(item => /^([^.]+)$/.test(item));

  packages.forEach(item => {
    const pkgPath = resolve(__dirname, '../packages/', item);
    const { name: pkgName } = JSON.parse(readFileSync(resolve(pkgPath, 'package.json'), 'utf-8'));
    const pkgRootPath = `<rootDir>/${item}`;
    moduleNameMapper[`^${pkgName}$`] = `${pkgRootPath}/src`;
  });

  console.log('packages:', moduleNameMapper);
  return {
    moduleNameMapper,
  };
};

const config = {
  watchPlugins: ['jest-watch-yarn-workspaces'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testTimeout: 30000,
  testEnvironment: 'jest-environment-node',
  verbose: true,
  testMatch: ['**/test/**/?(*.)+(spec).[jt]s?(x)'],
  rootDir: '../packages',
  moduleFileExtensions: EXTENSIONS,
  coverageDirectory: resolve(__dirname, '../coverage'),
  collectCoverageFrom: [`**/src/**/*.{${EXTENSIONS.join(',')}}`, '!**/node_modules/**', '!**/vendor/**'],
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: [`node_modules/(?!(${ES_MODEL_WHITELIST.join('|')}))`],
  ...createPkgConfigs(),
};

export default config;
