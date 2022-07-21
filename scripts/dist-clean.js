import { readdirSync } from 'fs';
import { resolve } from 'path';
import shell from 'shelljs';

// 遍历所有的包获取版本
const packages = readdirSync(resolve(__dirname, '../packages/'));
packages
  .filter(item => /^([^.]+)$/.test(item))
  .forEach(item => {
    let packagePath = resolve(__dirname, '../packages/', item);
    let distDirPath = packagePath + '/dist';
    try {
      shell.exec(`rm -fr ${distDirPath}`, {
        silent: true,
      });
      console.log('delete dist dir', item, distDirPath);
    } catch (error) {
      console.log('local-pkg-ver:', item, distDirPath, error);
    }
  });
