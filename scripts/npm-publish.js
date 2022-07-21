import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import shell from 'shelljs';
import { showPublishLog } from './util.js';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function compare(version1, version2) {
  let arr1 = version1.split('.'); //版本1分割
  let arr2 = version2.split('.'); //版本2分割
  let [firstFlag, secondFlag, thirdFlag] = [false, false, false]; //定义版本的三个部分大小标志
  //1.判断第一位
  if (Number.parseInt(arr1[0], 10) > Number.parseInt(arr2[0], 10)) {
    firstFlag = true;
  }
  //2.判断第二位
  if (Number.parseInt(arr1[1], 10) > Number.parseInt(arr2[1], 10)) {
    secondFlag = true;
  }
  /*3.判断第三位
      1.全部为数字  
      2.全部为字母
      3.数字字母混合
  */
  if (Number(arr1[2]) && Number(arr2[2])) {
    thirdFlag = Number.parseInt(arr1[2], 10) > Number.parseInt(arr2[2], 10);
    //如果parseInt之后都为NaN，说明都是字母
  } else if (Number.isNaN(Number.parseInt(arr1[2], 10)) && Number.isNaN(Number.parseInt(arr2[2], 10))) {
    thirdFlag = arr1[2].charCodeAt() > arr2[2].charCodeAt();
  }
  return firstFlag || secondFlag || thirdFlag;
}

// 遍历所有的包获取版本
const packages = readdirSync(resolve(__dirname, '../packages/'));
packages
  .filter(item => /^([^.]+)$/.test(item))
  .forEach(item => {
    let packagePath = resolve(__dirname, '../packages/', item);
    //获取package.json版本
    const {
      name,
      version,
      private: isPrivate,
    } = JSON.parse(readFileSync(resolve(packagePath, 'package.json'), 'utf-8'));

    if (!isPrivate) {
      //获取已发布的最新版本
      showPublishLog('检查升级:', name);
      let latestPubVer = shell.exec(`yarn info ${name} dist-tags.latest -s`, {
        silent: true,
      }).stdout;
      latestPubVer = latestPubVer.replace(/[\r\n]/g, '').replace(/\ +/g, '');

      if (latestPubVer.trim() === version.trim() || compare(latestPubVer, version)) {
        return;
      }

      try {
        showPublishLog('开始升级');
        shell.exec(`cd ${packagePath} && npm publish`, {
          silent: true,
        });
        showPublishLog('升级成功:', name, `${latestPubVer} > ${version}`);
      } catch (error) {
        showPublishLog('升级失败:', name, version, error);
      }
    }
  });
