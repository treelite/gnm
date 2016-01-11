/**
 * @file 取消使用
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import getRoot from './util/getRoot';
import getBins from './util/getBins';

/**
 * unlink
 *
 * @public
 * @param {string} name 模块名
 * @param {string} version 版本号
 */
export default function (name, version) {
    let root = getRoot();
    let bins = Object.keys(getBins(name, version));
    bins.forEach(name => fs.unlinkSync(path.resolve(root, 'bin', name)));
    fs.unlinkSync(path.resolve(root, 'lib', 'node_modules', name));
}
