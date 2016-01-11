/**
 * @file 获取全局的根目录
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import path from 'path';
import {execSync} from 'child_process';

let root;

/**
 * 获取全局的根目录
 *
 * @public
 * @return {string}
 */
export default function () {
    if (!root) {
        root = path.resolve(execSync('which npm', {encoding: 'utf8'}), '..', '..');
    }
    return root;
}
