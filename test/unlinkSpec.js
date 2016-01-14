/**
 * @file unlink spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import unlink from '../lib/unlink';
import * as meta from '../lib/meta';
import {execSync} from 'child_process';
import exists from '../lib/util/exists';
import getRoot from '../lib/util/getRoot';

describe('unlink', () => {

    beforeEach(() => {
        let name = 'xtend';
        let version = '0.1.0';
        let dir = path.join(meta.BASE_DIR, 'node_modules', name, version);
        mkdirp.sync(dir);
        fs.writeFileSync(
            path.join(dir, 'package.json'),
            JSON.stringify({name: name, version: version, bin: './bin/xtend'}),
            'utf8'
        );
        mkdirp.sync(path.join(dir, 'bin'));
        let binFile = path.join(dir, 'bin', 'xtend');
        fs.writeFileSync(binFile, '', 'utf8');

        let root = getRoot();
        fs.symlinkSync(binFile, path.join(root, 'bin', 'xtend'));
        fs.symlinkSync(dir, path.join(root, 'lib', 'node_modules', name));

        meta.add(name, version);
        meta.use(name, version);
    });

    afterEach(() => {
        let dir = path.join(meta.BASE_DIR, 'node_modules');
        execSync(`rm -rf ${dir}`);
        let pkgs = meta.get();
        pkgs.forEach(item => item.versions.forEach(version => meta.rm(item.name, version)));
    });

    it('package should unlink dir and bin', () => {
        let root = getRoot();
        expect(exists(path.join(root, 'bin', 'xtend'))).toBeTruthy();
        expect(exists(path.join(root, 'lib', 'node_modules', 'xtend'))).toBeTruthy();
        expect(meta.get('xtend').ver).toBe('0.1.0');
        unlink('xtend', '0.1.0');
        expect(exists(path.join(root, 'bin', 'xtend'))).toBeFalsy();
        expect(exists(path.join(root, 'lib', 'node_modules', 'xtend'))).toBeFalsy();
        expect(meta.get('xtend').ver).toBeUndefined();
    });

});
