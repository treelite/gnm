/**
 * @file ls package
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import * as meta from '../lib/meta';

let pkgs = meta.get();

if (!pkgs.length) {
    console.log('(empty)');
    process.exit(0);
}

pkgs.forEach(item => {
    let versions = item.versions.join(', ');
    let ver = item.ver || 'unused';
    console.log(`${item.name}@${ver} (${versions})`);
});
