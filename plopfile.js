/* eslint-disable no-console */

const { spawn } = require('child_process');
const { resolve } = require('path');
const { platform } = require('os');
const { rename } = require('fs');
const { promisify } = require('util');

const npmCmd = platform().startsWith('win') ? 'npm.cmd' : 'npm';
const rename$ = promisify(rename);

const spawn$ = (...args) => new Promise((fnResolve, fnReject) => {
  const cmd = spawn(...args);
  cmd.on('close', fnResolve);
  cmd.on('error', fnReject);
});

function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}

module.exports = (plop) => {
  // controller generator
  plop.setGenerator('module', {
    description: 'Create new module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Choose a name',
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Init git repository',
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'Install dependencies',
      },
    ],
    actions: [
      {
        type: 'addMany',
        templateFiles: 'plop/module/**/*!(*.hbs)',
        destination: 'modules/{{name}}',
        skipIfExists: true,
        base: 'plop/module',
        globOptions: {
          dot: true,
        },
      },
      async (answers) => {
        const p = resolve('modules', answers.name);
        try {
          await rename$(`${p}/package.json.hbs`, `${p}/package.json`);
          return 'package.json.hbs has been renamed';
        } catch (e) {
          console.log(e);
          return 'Error while renaming package.json.hbs file';
        }
      },
      async (answers) => {
        if (answers.git !== true) {
          return 'Git has been ignored';
        }
        console.log('Initializing git repository');
        try {
          await spawn$('git', ['init'], {
            cwd: resolve('modules', answers.name),
            detached: true,
            stdio: 'inherit',
          });
        } catch (e) {
          console.error(e);
        }
        return 'Git repository has been initialized';
      },
      async (answers) => {
        if (answers.install !== true) {
          return 'Dependencies are ignored';
        }
        console.log('Installing dependencies');
        await spawn$(
          npmCmd,
          ['install'],
          {
            cwd: resolve('modules', answers.name),
            detached: true,
            stdio: 'inherit',
          },
        );
        return 'Dependencies installed successfully';
      },
    ],
  });

  // Create the camelize helper
  plop.setHelper('camelize', txt => camelize(txt));
  plop.setHelper('raw-helper', options => options.fn());
};
