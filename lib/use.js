/**
 * @file 使用模块
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import exec from './util/exec';
import * as meta from './meta';

/**
 * 获取全局的安装目录
 *
 * @return {Promise}
 */
function getPath() {
    return exec('which npm')
        .then(dir => path.resolve(path.dirname(dir), '..'));
}

/**
 * 获取模块的 bin 配置
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 * @return {Object}
 */
function getBins(name, version) {
    let file = path.resolve(meta.BASE_DIR, 'node_modules', name, version, 'package.json');
    let info = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!info.bin) {
        return [];
    }

    let res;
    if (typeof info.bin === 'string') {
        res = {};
        res[path.basename(info.bin)] = info.bin;
    }

    return res;
}

/**
 * unlink
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 * @param {string} dir 安装目录
 */
function unuse(name, version, dir) {
    if (!version) {
        return;
    }
    let bins = Object.keys(getBins(name, version));
    bins.forEach(name => fs.unlinkSync(path.resolve(dir, 'bin', name)));
    fs.unlinkSync(path.resolve(dir, 'lib', 'node_modules', name));
}

/**
 * link
 *
 * @param {string} name 模块名
 * @param {string} version 版本号
 * @param {string} dir 安装目录
 */
function use(name, version, dir) {
    let bins = getBins(name, version);
    let baseDir = path.resolve(meta.BASE_DIR, 'node_modules', name, version);
    Object.keys(bins).forEach(key => {
        let target = path.resolve(baseDir, bins[key]);
        fs.symlinkSync(target, path.resolve(dir, 'bin', key));
    });
    fs.symlinkSync(baseDir, path.resolve(dir, 'lib', 'node_modules', name));
    meta.use(name, version);

    return {name,version};
}

/**
 * 使用模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string=} version 模块名
 * @return {Promise}
 */
export default function (name, version) {
    let info = meta.get(name);
    if (!info) {
        return Promise.reject(`unkonw package ${name}`);
    }

    version = version || info.versions[0];

    // 版本正在使用中就啥都不用干了
    if (info.ver === version) {
        return Promise.resolve({name, version});
    }

    return getPath()
        .then(dir => unuse(name, info.ver, dir) || use(name, version, dir));
}
