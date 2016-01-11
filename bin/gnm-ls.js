/**
 * @file ls package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import * as meta from '../lib/meta';

let pkgs = meta.get();
let name = process.argv[2];

if (name) {
    pkgs = pkgs.filter(item => item.name === name);
}

if (!pkgs.length) {
    process.exit(0);
}

pkgs.forEach(item => {
    let versions = item.versions.join(', ');
    let ver = item.ver || 'unused';
    console.log(`${item.name}@${ver} (${versions})`);
});
