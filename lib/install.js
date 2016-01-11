/**
 * @file Install module
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import * as meta from './meta';
import exec from './util/exec';
import exists from './util/exists';

/**
 * 模块的安装目录
 *
 * @const
 * @type {string}
 */
const DIR = path.resolve(meta.BASE_DIR, 'node_modules');

/**
 *  确保文件夹存在
 *
 * @type {Function}
 */
let ensure = dir => !exists(dir) && mkdirp.sync(dir);

/**
 * 移动模块的依赖
 *
 * @param {string} source 源目录
 * @param {string} target 目标目录
 * @return {Promise}
 */
function moveDeps(source, target) {
    let modules = fs.readdirSync(source);
    if (!modules.length) {
        return Promise.resolve();
    }

    target = path.resolve(target, 'node_modules');
    ensure(target);

    let tasks = modules.map(name => {
        let from = path.resolve(source, name);
        let to = path.resolve(target, name);
        return exec(`mv ${from} ${to}`);
    });

    return Promise.all(tasks);
}

/**
 * 安装 module
 *
 * @param {string} name 模块名
 * @param {string=} version 模版版本
 * @param {string} dir 模块的临时存放位置
 * @return {Promise}
 */
function install(name, version, dir) {
    let file = path.resolve(dir, 'package.json');
    let info = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (!version) {
        version = info.version;
    }

    // 如果已经存在对应版本的模块
    // 就啥都不用做了
    if (meta.has(name, version)) {
        return Promise.resolve({name, version});
    }

    let targetDir = path.resolve(DIR, name, version);
    ensure(path.dirname(targetDir));

    return exec(`mv ${dir} ${targetDir}`)
        .then(() => moveDeps(path.dirname(dir), targetDir))
        .then(() => meta.add(name, version));
}

/**
 * 安装模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string=} version 模块版本
 * @return {Promise}
 */
export default function (name, version) {
    let fullName = name;
    if (version) {
        fullName += '@' + version;
    }

    if (meta.has(name, version)) {
        return Promise.reject(`${fullName} has existed`);
    }

    // 创建一个临时文件夹存放下载的模块
    let tmpDir = path.resolve(meta.BASE_DIR, 'tmp_' + Date.now());
    mkdirp.sync(tmpDir);
    mkdirp.sync(path.resolve(tmpDir, 'node_modules'));

    let clear = () => exec(`rm -rf ${tmpDir}`);

    return exec(`npm install --save ${fullName}`, {cwd: tmpDir})
        .then(() => install(name, version, path.resolve(tmpDir, 'node_modules', name)))
        .then(
            info => clear().then(() => info),
            error => clear().then(() => Promise.reject(error))
        );
}
