/**
 * @file exists
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';

/**
 * 检查文件 or 文件夹是否存在
 *
 * @public
 * @param {string} file 文件路径
 * @return {boolean}
 */
export default function (file) {
    let res = true;
    try {
        fs.accessSync(file);
    }
    catch (e) {
        res = false;
    }
    return res;
}
