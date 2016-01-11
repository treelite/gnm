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
    .parse(process.argv);

let [name, version] = (program.args[0] || '').split('@');

if (!name) {
    console.error('please input package');
    process.exit(1);
}

let fullName = name;
let info = meta.get(name);
if (version) {
    fullName += '@' + version;
}
else {
    version = info.versions[0];
}

if (info.ver && info.ver === version && !program.force) {
    console.error(`can not remove ${fullName} currently in use`);
    process.exit(1);
}

rm(name, version)
    .then(
        info => console.log(`remove ${info.name}@${info.version}`),
        error => console.error(error) || process.exit(1)
    );
