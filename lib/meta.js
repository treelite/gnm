/**
 * @file Meta
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import os from 'os';
import path from 'path';
import FileData from './util/FileData';

/**
 * 根目录
 *
 * @const
 * @type {string}
 */
const DIR = path.resolve(os.homedir(), '.gnm');

/**
 * 元数据文件路径
 *
 * @const
 * @type {string}
 */
const FILE = path.resolve(DIR, 'meta.json');

let meta = new FileData(FILE);

/**
 * 根目录
 *
 * @const
 * @type {string}
 */
export const BASE_DIR = DIR;

/**
 * 参数配置
 *
 * @public
 * @param {stirng=} key 键
 * @param {string=} value 值
 * @return {*}
 */
export function config(key, value) {
    let config = meta.get('config') || {};
    if (!arguments.length) {
        return config;
    }
    else if (arguments.length === 1) {
        return config[key];
    }
    config[key] = value;
    meta.set('config', config);
    return value;
}

/**
 * 获取已安装的模块
 *
 * @public
 * @return {Array.<Object>}
 */
export function get() {
    return  meta.get('packages') || [];
}

/**
 * 添加模块
 *
 * @public
 * @param {sting} name 模块名
 * @param {string=} version 模块版本
 * @return {Object}
 */
export function add(name, version) {
    let pkgs = get();
    let item = pkgs.find(item => item.name === name);
    if (item) {
        item.versions.push(version);
    }
    else {
        pkgs.push({
            name: name,
            versions: [version]
        });
    }
    meta.set('packages', pkgs);
    return {name, version};
}

/**
 * 是否已经安装模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string} version 模块版本
 * @return {boolean}
 */
export function has(name, version) {
    let pkgs = get();
    let item = pkgs.find(item => item.name === name);
    return item && item.versions.indexOf(version) >= 0;
}

/**
 * 使用模块
 *
 * @public
 * @param {string} name 模块名
 * @param {string} version 模块版本
 */
export function use(name, version) {
    let pkgs = get();
    let item = pkgs.find(item => item.name === name);

    if (!item) {
        throw new Error(`can not find package: ${name}`);
    }
    if (item.versions.indexOf(version) < 0) {
        throw new Error(`${name} do not hava a version ${version}`);
    }

    item.ver = version;
    meta.set('packages', pkgs);
}