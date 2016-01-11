/**
 * @file 删除模块
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import path from 'path';
import unlink from './unlink';
import * as meta from './meta';
import exec from './util/exec';

/**
 * 删除
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 * @return {Promise}
 */
function rm(name, version) {
    let parentDir = path.resolve(meta.BASE_DIR, 'node_modules', name);
    let dir = path.resolve(parentDir, version);
    let clear = () => meta.get(name) ? Promise.resolve() : exec(`rm -rf ${parentDir}`);
    let handleMeta = () => meta.rm(name, version);
    return exec(`rm -rf ${dir}`).then(handleMeta).then(clear).then(() => ({name, version}));
}

/**
 * 删除模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string=} version 版本号 如果没有版本号就删除所有的版本
 * @return {Array.<Promise>}
 */
export default function (name, version) {
    let info = meta.get(name);
    if (!info) {
        return Promise.reject(`unkonw package ${name}`);
    }

    if (info.ver && (!version || info.ver === version)) {
        unlink(name, info.ver);
    }

    let versions = version ? [version] : info.versions;
    return versions.map(ver => rm(name, ver));
}
