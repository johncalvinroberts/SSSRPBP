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
const copyFile = promisify(fs.copyFile);
const rename = promisify(fs.rename);
const ignoreFileName = 'sssrpbp.gitignore';

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
    let {
      name,
      template = 'default',
      'exclude-gh-actions': excludeGithubActions = false,
    } = argv;

    if (!name) {
      throw new Error(
        'No name for the app was provided, try npx sssrpbp --name=<the name of folder>',
      );
    }

    if (excludeGithubActions) {
      excludeGithubActions = excludeGithubActions === 'true';
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
    await rename(
      path.join(dest, ignoreFileName),
      path.join(dest, '.gitignore'),
    );
    if (!excludeGithubActions) {
      await mkdirp(`${dest}/.github`);
      await mkdirp(`${dest}/scripts`);
      const source = path.join(__dirname, '..', 'template', 'common');
      await copyFile(`${source}/ci.yml`, `${dest}/.github/ci.yml`);
      await copyFile(
        `${source}/ensure-git-clean.sh`,
        `${dest}/scripts/ensure-git-clean.sh`,
      );
    }
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
