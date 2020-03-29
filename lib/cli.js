'use strict';

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const pEachSeries = require('p-each-series');
const mkdirp = require('make-dir');
const { argv } = require('yargs');
const chalk = require('chalk');
const ora = require('ora');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function copyTemplateFile({ file, source, dest }) {
  const fileRelativePath = path.relative(source, file);
  const destFilePath = path.join(dest, fileRelativePath);
  const destFileDir = path.parse(destFilePath).dir;

  await mkdirp(destFileDir);

  const template = await readFile(file, 'utf8');

  await writeFile(destFilePath, template, 'utf8');

  return fileRelativePath;
}

(async () => {
  try {
    const { name, template = 'default' } = argv;

    if (!name) {
      throw new Error(
        'No name for the app was provided, try npx sssrpbp --name=<the name of folder>',
      );
    }
    const dest = path.join(process.cwd(), name);
    const source = path.join(__dirname, '..', 'template', template);
    const files = await globby(source, {
      dot: true,
    });

    const promise = pEachSeries(files, async (file) => {
      return copyTemplateFile({
        file,
        source,
        dest,
      });
    });
    ora.promise(promise, `Copying ${template} template to ${dest}`);
    await promise;
    console.log(
      chalk.cyan(`
Done copying the template.

> cd ${name}
> git init
> yarn

Then start writing code of questionable integrity, as promised.
    `),
    );
  } catch (error) {
    console.error(chalk.red(error));
    console.log(chalk.red('Failed to create package'));
  }
})();
