import { showBuildLog } from './util.js';

const prod = 'prod';
const dev = 'dev';

export const setEnv = env => {
  if (env === dev) {
    setEnvToDev();
  } else {
    setEnvToProd();
  }
  showBuildLog('SET ENV:', process.env.foo);
};

const setEnvToDev = () => {
  process.env.foo = dev;
};

const setEnvToProd = () => {
  process.env.foo = prod;
};

export const isDevEnv = () => {
  return process.env.foo === dev;
};

export const isProdEnv = () => {
  return process.env.foo === prod;
};

export const getEnv = () => {
  return process.env.foo;
};
