/**
 * @file getBins spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import {BASE_DIR} from '../lib/meta';
import {execSync} from 'child_process';
import getBins from '../lib/util/getBins';

const DIR = path.resolve(BASE_DIR, 'node_modules');

describe('getBins', () => {

    function createFile(name, version, data) {
        let dir = path.resolve(DIR, name, version);
        mkdirp.sync(dir);
        fs.writeFileSync(path.resolve(dir, 'package.json'), JSON.stringify(data), 'utf8');
    }

    beforeAll(() => {
        mkdirp.sync(DIR);
    });

    afterAll(() => {
        execSync(`rm -rf ${DIR}`);
    });

    it('get empty', () => {
        createFile('test', '0.1.0', {name: 'test'});
        expect(getBins('test', '0.1.0')).toEqual({});
    });

    it('get object', () => {
        createFile('test', '0.1.1', {name: 'test', bin: './bin/main'});
        expect(getBins('test', '0.1.1')).toEqual({main: './bin/main'});
    });

    it('get all bins', () => {
        let bin = {
            main: './bin/main.js'
        };
        createFile('test', '0.1.2', {name: 'test', bin: bin});
        expect(getBins('test', '0.1.2')).toEqual(bin);
    });

});
