import { rollup as _rollup, watch as _watch } from 'rollup';
import postcss from 'rollup-plugin-postcss';
import { showBuildLog } from './util.js';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';
import typescript from 'rollup-plugin-typescript2';

const IGNORE_WARNING_CODE = ['UNRESOLVED_IMPORT', 'CIRCULAR_DEPENDENCY'];

function getRollupConfig(config) {
  const { inputFile, outputFile, tsconfig, bundleType } = config;
  const inputOptions = {
    input: inputFile,
    plugins:
      bundleType === 'd'
        ? [dts()]
        : [
            url(),
            svgr({ icon: true }),
            typescript({
              tsconfig,
              abortOnError: false,
              clean: true,
              check: false,
            }),
            postcss({
              minimize: true,
              modules: true,
              use: {
                sass: null,
                stylus: null,
                less: { javascriptEnabled: true },
              },
            }),
            esbuild({
              include: /\.[jt]sx?$/,
              exclude: /node_modules/,
              sourceMap: false,
              minify: process.env.NODE_ENV === 'production',
              target: 'esnext',
              jsx: 'transform',
              jsxFactory: 'React.createElement',
              jsxFragment: 'React.Fragment',
              define: {
                __VERSION__: '"x.y.z"',
              },
              tsconfig: 'tsconfig.json',
              loaders: {
                '.json': 'json',
                '.js': 'jsx',
              },
            }),
          ],
    onwarn: (warning, warn) => {
      if (IGNORE_WARNING_CODE.indexOf(warning.code) !== -1) return;
      throw new Error(warning.message);
    },
  };

  const outputOptions = {
    file: outputFile,
    format: bundleType === 'd' ? 'es' : bundleType,
    sourcemap: true,
    plugins: [],
    globals: { react: 'React', zustand: 'zustand' },
  };

  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {},
  };

  return {
    inputOptions,
    outputOptions,
    watchOptions,
  };
}

export function build(configs, isWatch, onAllBuildEnd, pkgCount) {
  showBuildLog(`PKG TOTAL:`, `${pkgCount}个`);

  let buildTotal = configs.length;

  const buildByIndex = buildIndex => {
    const pkgConfig = configs[buildIndex];
    if (pkgConfig) {
      const rollupConfig = getRollupConfig(pkgConfig);
      buildPkg(pkgConfig, rollupConfig, isWatch, onBuildPkgEndCallback);
    }
  };

  const onBuildPkgEndCallback = () => {};

  for (let index = 0; index < buildTotal; index++) {
    buildByIndex(index);
  }
}

async function buildPkg(pkgConfig, rollupConfig, isWatch, onBuildPkgEnd) {
  const { pkgName, outputFile } = pkgConfig;
  const { inputOptions, outputOptions, watchOptions } = rollupConfig;

  const bundle = await _rollup(inputOptions);
  const watcher = _watch(watchOptions);
  await bundle.write(outputOptions);
  onWatcher(watcher, isWatch, pkgName, outputFile).then(() => {
    onBuildPkgEnd();
  });
}

function onWatcher(watcher, isWatch, pkgName, outputFile) {
  return new Promise(resolve => {
    watcher.on('event', event => {
      const { code } = event;
      if (code === 'BUNDLE_START') {
        // showBuildLog('BEGIN', pkgName);
      } else if (code === 'BUNDLE_END') {
        const { duration } = event;
        showBuildLog('SUCCESS:', outputFile, `> DURATION: `, duration);
        resolve();
        if (!isWatch) {
          watcher.close();
        }
      } else if (code === 'ERROR' || code === 'FATAL') {
        showBuildLog('ERROR', event);
        if (!isWatch) {
          watcher.close();
        }
      }
    });
  });
}
