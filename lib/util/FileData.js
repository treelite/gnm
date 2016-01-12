/**
 * @file FileData
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import extend from 'xtend';
import mkdirp from 'mkdirp';
import exists from './exists';

/**
 * 文件数据
 *
 * @class
 */
export default class {

    constructor(file) {
        this.file = file;
        if (exists(file)) {
            this.data = JSON.parse(fs.readFileSync(file, 'utf8'));
        }
        else {
            this.data = {};
            let dir = path.dirname(file);
            if (!exists(dir)) {
                this.mkdir = dir;
            }
        }
    }

    /**
     * 获取数据
     *
     * @public
     * @param {string} key 键
     * @return {*}
     */
    get(key) {
        let res = this.data[key];
        if (Array.isArray(res)) {
            res = res.concat();
        }
        else if (Object.prototype.toString.call(res) === '[object Object]') {
            res = extend(res);
        }
        return res;
    }

    /**
     * 设置数据
     *
     * @public
     * @param {string} key 键
     * @param {*} value 值
     */
    set(key, value) {
        this.data[key] = value;
        if (this.mkdir) {
            mkdirp.sync(this.mkdir);
            this.mkdir = null;
        }
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), 'utf8');
    }
}
