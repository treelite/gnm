/**
 * @file meta spec
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import os from 'os';
import path from 'path';
import * as meta from '../lib/meta';

const BASE_DIR = path.resolve(os.homedir(), '.gnm');

describe('Meta', () => {

    afterAll(() => {
        let pkgs = meta.get();
        pkgs.forEach(item => item.versions.forEach(version => meta.rm(item.name, version)));
    });

    it('BASE_DIR', () => {
        expect(meta.BASE_DIR).toEqual(BASE_DIR);
    });

    it('set/get config', () => {
        let key = 'name';
        let value = 'treelite';

        expect(meta.config(key)).toBeUndefined();

        expect(meta.config(key, value)).toEqual(value);

        let data = meta.config();
        expect(Object.keys(data)).toEqual([key]);
        expect(data[key]).toEqual(value);
    });

    describe('add/get/has package', () => {

        it('get empty', () => {
            expect(meta.get()).toEqual([]);
        });

        it('add new package', () => {
            let pkg = {name: 'test', versions: ['0.1.0']};
            expect(meta.add('test', '0.1.0')).toEqual({name: 'test', version: '0.1.0'});
            expect(meta.get()).toEqual([pkg]);
            expect(meta.get('test')).toEqual(pkg);
            expect(meta.get('unknow')).toBeUndefined();

            meta.add('foo', '0.1.0');
            expect(meta.get().length).toEqual(2);
        });

        it('add new version', () => {
            meta.add('test', '0.2.0');
            expect(meta.get('test').versions).toEqual(['0.2.0', '0.1.0']);
            meta.add('test', '0.1.1');
            expect(meta.get('test').versions).toEqual(['0.2.0', '0.1.1', '0.1.0']);
        });

        it('has', () => {
            expect(meta.has('test', '0.1.0')).toBeTruthy();
            expect(meta.has('test', '0.1.2')).toBeFalsy();
            expect(meta.has('unknow', '0.1.0')).toBeFalsy();
        });

    });

    describe('use', () => {

        it('none existed package', () => {
            let fault = false;
            try {
                meta.use('unknow', '0.1.0');
            }
            catch (e) {
                fault = true;
            }
            expect(fault).toBeTruthy();
        });

        it('none existed version', () => {
            let fault = false;
            try {
                meta.use('test', '10.0.0');
            }
            catch (e) {
                fault = true;
            }
            expect(fault).toBeTruthy();
        });

        it('package succes', () => {
            expect(meta.get('test').ver).toBeUndefined();
            meta.use('test', '0.2.0');
            expect(meta.get('test').ver).toEqual('0.2.0');
        });

    });

    describe('rm', () => {

        it('none existed package is no effect', () => {
            let pkgs = meta.get();
            meta.rm('unknow', '0.1.0');
            expect(meta.get()).toEqual(pkgs);
        });

        it('a version of a package', () => {
            meta.rm('test', '0.1.0');
            expect(meta.get('test').versions).toEqual(['0.2.0', '0.1.1']);
            expect(meta.get('test').ver).toEqual('0.2.0');
            expect(meta.get('foo').versions).toEqual(['0.1.0']);
        });

        it('a version in using', () => {
            expect(meta.get('test').ver).toEqual('0.2.0');
            meta.rm('test', '0.2.0');
            expect(meta.get('test').versions).toEqual(['0.1.1']);
            expect(meta.get('test').ver).toBeUndefined();
        });

        it('a package', () => {
            meta.rm('test', '0.1.1');
            expect(meta.get('test')).toBeUndefined();
        });

    });

});
