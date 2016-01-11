/**
 * @file Install package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import use from '../lib/use';
import program from 'commander';
import * as meta from '../lib/meta';
import install from '../lib/install';

program
    .option('-f force', 'force use module')
    .parse(process.argv);

let [name, version] = (program.args[0] || '').split('@');

if (!name) {
    console.error('please input package name');
    process.exit(1);
}

let info = meta.get(name);

if (!info) {
    console.error(`${name} do not exist`);
    process.exit(1);
}

version = version || info.versions[0];

let before = Promise.resolve();
if (!meta.has(name, version)) {
    if (!program.force) {
        let fullName = name + (version ? '@' + version : '');
        console.error(`please install ${fullName} first`);
        process.exit(1);
    }
    else {
        before = install(name, version);
    }
}

before
    .then(() => use(name, version))
    .then(
        info => console.log(`use ${info.name}@${info.version}`),
        error => console.error(error) || process.exit(1)
    );
