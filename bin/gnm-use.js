/**
 * @file Install package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import use from '../lib/use';

let [name, version] = (process.argv[2] || '').split('@');

if (!name) {
    console.error('Please input package');
    process.exit(1);
}

use(name, version)
    .then(
        info => console.log(`use ${info.name}@${info.version}`),
        error => console.error(error) || process.exit(1)
    );
