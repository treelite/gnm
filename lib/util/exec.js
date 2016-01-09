/**
 * @file Execute command
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import {exec} from 'child_process';

/**
 * 执行外部命令
 *
 * @public
 * @param {string} cmd 命令
 * @param {Object=} options 配置参数
 * @return {Promise}
 */
export default function (cmd, options) {
    return new Promise((resolve, reject) => {
        exec(cmd, options, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            }
            else {
                resolve(stdout);
            }
        });
    });
}
