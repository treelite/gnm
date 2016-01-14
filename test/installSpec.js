/**
 * @file install spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import * as meta from '../lib/meta';
import install from '../lib/install';
import {execSync} from 'child_process';

const TIME_OUT = 20 * 1000;

describe('installing', () => {

    afterEach(() => {
        let dir = path.join(meta.BASE_DIR, 'node_modules');
        execSync(`rm -rf ${dir}`);
        let pkgs = meta.get();
        pkgs.forEach(item => item.versions.forEach(version => meta.rm(item.name, version)));
    });

    it('a existent package should reject', done => {
        meta.add('test', '0.1.0');
        install('test', '0.1.0').catch(done);
    });

    it('a package should put it in the right dir and return the name & version', done => {
        let name = 'xtend';
        let version = '2.0.1';
        install(name, version)
            .then(
                info => {
                    expect(info.name).toEqual(name);
                    expect(info.version).toEqual(version);
                    let file = path.join(meta.BASE_DIR, 'node_modules', name, version, 'package.json');
                    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
                    expect(data.name).toEqual(name);
                    expect(data.version).toEqual(version);
                    expect(meta.get(name)).toEqual({name: name, versions: [version]});
                    done();
                }
            );
    }, TIME_OUT);

    it('a package without version should install the latest version', done => {
        let name = 'xtend';
        install(name)
            .then(
                info => {
                    let version = info.version;
                    let [major] = version.split('.');
                    expect(major >= 4).toBeTruthy();
                    let file = path.join(meta.BASE_DIR, 'node_modules', name, version, 'package.json');
                    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
                    expect(data.name).toEqual(name);
                    expect(data.version).toEqual(version);
                    done();
                }
            );
    }, TIME_OUT);

    it('should remove temporary dir after finish', done => {
        install('xtend', '2.0.1')
            .then(
                () => {
                    let files = fs.readdirSync(meta.BASE_DIR);
                    expect(files.length).toEqual(2);
                    expect(files.indexOf('meta.json') >= 0).toBeTruthy();
                    expect(files.indexOf('node_modules') >= 0).toBeTruthy();
                    done();
                }
            )
    }, TIME_OUT);
});
