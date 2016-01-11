/**
 * @file Install package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import install from '../lib/install';

let [name, version] = (process.argv[2] || '').split('@');

if (!name) {
    console.error('please input package name');
    process.exit(1);
}

install(name, version)
    .then(
        info => console.log(`${info.name}@${info.version} installed`),
        error => console.error(error) || process.exit(1)
    );
