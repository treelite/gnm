/**
 * @file 使用模块
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import unlink from './unlink';
import * as meta from './meta';
import getRoot from './util/getRoot';
import getBins from './util/getBins';

/**
 * link
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 */
function use(name, version) {
    let root = getRoot();
    let bins = getBins(name, version);
    let baseDir = path.resolve(meta.BASE_DIR, 'node_modules', name, version);
    Object.keys(bins).forEach(key => {
        let target = path.resolve(baseDir, bins[key]);
        fs.symlinkSync(target, path.resolve(root, 'bin', key));
    });
    fs.symlinkSync(baseDir, path.resolve(root, 'lib', 'node_modules', name));
    meta.use(name, version);
}

/**
 * 使用模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string} version 模块名
 * @return {Promise}
 */
export default function (name, version) {
    let info = meta.get(name);
    if (!info) {
        return Promise.reject(`unkonw package ${name}`);
    }

    // 版本正在使用中就啥都不用干了
    if (info.ver === version) {
        return Promise.resolve({name, version});
    }
    else if (info.ver) {
        unlink(name, info.ver);
    }

    use(name, version);

    return Promise.resolve({name, version});
}
