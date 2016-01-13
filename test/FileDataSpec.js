/**
 * @file FileData spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import exists from '../lib/util/exists';
import FileData from '../lib/util/FileData';

const FILE = path.resolve('/tmp', Date.now().toString(), 'data.json');

describe('FileData', () => {

    afterEach(() => {
        execSync(`rm -rf ${FILE}`);
    });

    it('get empty', () => {
        let data = new FileData(FILE);
        expect(exists(FILE)).toBeFalsy();
        expect(data.get('name')).toBeUndefined();
    });

    it('set data', () => {
        let data = new FileData(FILE);
        data.set('name', 'treelite');
        expect(exists(FILE)).toBeTruthy();
        let file = JSON.parse(fs.readFileSync(FILE, 'utf8'));
        expect(file.name).toEqual(data.get('name'));
    });

    it('get data by clone', () => {
        let data = new FileData(FILE);
        data.set('arr', [1, 2, 3]);
        let arr = data.get('arr');
        arr.push('4');
        expect(arr).not.toEqual(data.get('arr'));

        data.set('obj', {name: 'treelite'});
        let info = data.get('obj');
        info.age = 10;
        expect(info).not.toEqual(data.get('obj'));
    });

});
