/**
 * @file Install package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import rm from '../lib/rm';
import program from 'commander';
import * as meta from '../lib/meta';

program
    .option('-f force', 'force delete module')
    .option('-r roll', 'delete all versions module')
    .parse(process.argv);

let [name, version] = (program.args[0] || '').split('@');

if (!name) {
    console.error('please input package');
    process.exit(1);
}

let info = meta.get(name);

if (!info) {
    console.error(`${name} do not exist`);
    process.exit(1);
}

if (version) {
    program.roll = false;
}
else if (!program.roll) {
    version = info.versions[0];
}

if (info.ver && info.ver === version && !program.force) {
    console.error(`can not remove ${name}@${version} currently in use`);
    process.exit(1);
}

let tasks = rm(name, version);
Promise
    .all(tasks.map(task => task.then(info => console.log(`remove ${info.name}@${info.version}`))))
    .catch(error => console.error(error) || process.exit(1));
