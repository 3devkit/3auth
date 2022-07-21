import { rollup as _rollup, watch as _watch } from 'rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import postcss from 'rollup-plugin-postcss';
import { isProdEnv } from './env.js';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';
import { showBuildLog } from './util.js';

// https://github.com/ezolenko/rollup-plugin-typescript2

const IGNORE_WARNING_CODE = ['UNRESOLVED_IMPORT', 'CIRCULAR_DEPENDENCY'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function getRollupConfig(config) {
  const { inputFile, outputFile, tsconfig, bundleType } = config;
  const inputOptions = {
    input: inputFile,
    plugins: [
      peerDepsExternal(),
      url(),
      svgr({ icon: true }),
      postcss({
        minimize: true,
        modules: true,
        use: {
          sass: null,
          stylus: null,
          less: { javascriptEnabled: true },
        },
      }),
      // nodeResolve(),
      typescript({
        tsconfig,
        abortOnError: false,
        clean: true,
        check: false,
      }),
      // commonjs(),
      babel({
        babelrc: false,
        inputSourceMap: true,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: EXTENSIONS,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                esmodules: true,
              },
            },
          ],
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
        plugins: [],
      }),
      progress({
        clearLine: true,
      }),
      isProdEnv() &&
        strip({
          include: [],
          debugger: true,
          //functions: ['console.*', 'assert.*'],
          functions: ['assert.*'],
        }),
    ],
    onwarn: (warning, warn) => {
      if (IGNORE_WARNING_CODE.indexOf(warning.code) !== -1) return;
      throw new Error(warning.message);
    },
  };

  const outputOptions = {
    file: outputFile,
    format: bundleType,
    sourcemap: true,
    plugins: [isProdEnv() && terser()],
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

export function build(configs, isWatch, onAllBuildEnd) {
  let isFristBuild = true;
  let buildIndex = 0;
  let buildTotal = configs.length;
  showBuildLog(`PKG TOTAL:`, `${buildTotal}个`);

  const buildByIndex = buildIndex => {
    const pkgConfig = configs[buildIndex];
    if (pkgConfig) {
      const rollupConfig = getRollupConfig(pkgConfig);
      // showBuildLog('BEGIN:', `${buildIndex + 1}/${buildTotal}`, `> packageName : ${pkgConfig.pkgName}`);
      showBuildLog('BEGIN:', `${pkgConfig.pkgName}`, `> format : ${pkgConfig.bundleType}`);
      buildPkg(pkgConfig, rollupConfig, isWatch, onBuildPkgEndCallback);
    }
  };

  const onBuildPkgEndCallback = () => {
    // buildIndex++;
    // if (buildIndex < buildTotal) {
    //   buildByIndex(buildIndex);
    // } else {
    //   showBuildLog('FINISH');
    //   if (isWatch) {
    //     showBuildLog('HOT UPDATE, WATCH...');
    //   }
    //   if (isFristBuild) {
    //     isFristBuild = false;
    //     onAllBuildEnd();
    //   }
    // }
  };

  for (let index = 0; index < buildTotal; index++) {
    buildByIndex(index);
  }


  buildByIndex(buildIndex);
}

async function buildPkg(pkgConfig, rollupConfig, isWatch, onBuildPkgEnd) {
  const { pkgName } = pkgConfig;
  const { inputOptions, outputOptions, watchOptions } = rollupConfig;

  const bundle = await _rollup(inputOptions);
  const watcher = _watch(watchOptions);
  await bundle.write(outputOptions);
  onWatcher(watcher, isWatch, pkgName).then(() => {
    onBuildPkgEnd();
  });
}

function onWatcher(watcher, isWatch, pkgName) {
  return new Promise(resolve => {
    watcher.on('event', event => {
      const { code } = event;
      if (code === 'BUNDLE_START') {
        showBuildLog('BEGIN', pkgName);
      } else if (code === 'BUNDLE_END') {
        const { duration } = event;
        showBuildLog('SUCCESS:', pkgName, `> DURATION: `, duration);
        // showBuildLog('END');
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
