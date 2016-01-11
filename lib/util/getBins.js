/**
 * @file 获取模块的 bin 配置
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import {BASE_DIR} from '../meta';

/**
 * 获取模块的 bin 配置
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 * @return {Object}
 */
export default function (name, version) {
    let file = path.resolve(BASE_DIR, 'node_modules', name, version, 'package.json');
    let info = JSON.parse(fs.readFileSync(file, 'utf8'));
    let res = info.bin;

    if (!res) {
        return {};
    }

    if (typeof res === 'string') {
        res = {};
        res[path.basename(info.bin)] = info.bin;
    }

    return res;
}
