/**
 * @file CLI
 * @author treelite(c.xinle@gmail.com)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import program from 'commander';

let file = path.resolve(__dirname, '..', 'package.json');
let info = JSON.parse(fs.readFileSync(file, 'utf8'));

program
    .version(info.version)
    .command('ls', 'list modules installed')
    .command('install [name]', 'install a module and use it in global')
    .command('use [name][@version]', 'use a module in global')
    .command('rm [name][@version]', 'rm a module')
    .parse(process.argv);
