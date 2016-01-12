/**
 * @file meta spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import os from 'os';
import path from 'path';
import * as meta from '../lib/meta';
import {execSync} from 'child_process';
import exists from '../lib/util/exists';

const BASE_DIR = path.resolve(os.homedir(), '.gnm');
const FILE = path.resolve(BASE_DIR, 'meta.json');

describe('Meta', () => {

    beforeEach(() => {
        execSync(`rm -rf ${FILE}`);
    });

    it('BASE_DIR', () => {
        expect(meta.BASE_DIR).toEqual(BASE_DIR);
    });

    it('set/get config', () => {
        let key = 'name';
        let value = 'treelite';

        expect(meta.config(key)).toBeUndefined();
        expect(exists(FILE)).toBeFalsy();

        expect(meta.config(key, value)).toEqual(value);
        expect(exists(FILE)).toBeTruthy();

        let data = meta.config();
        expect(Object.keys(data)).toEqual([key]);
        expect(data[key]).toEqual(value);
    });

});
