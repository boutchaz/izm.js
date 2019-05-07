/* eslint-disable no-console */

const { spawn } = require('child_process');
const { resolve } = require('path');

const spawn$ = (...args) => new Promise((res) => {
  const cmd = spawn(...args);
  cmd.on('close', res);
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
        default: false,
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
        templateFiles: 'plop/module/**',
        destination: 'modules/{{name}}',
        skipIfExists: true,
        base: 'plop/module',
        globOptions: {
          dot: true,
        },
      },
      async (answers) => {
        if (answers.git !== true) {
          return;
        }
        console.log('Initializing git repository');
        await spawn$('git', ['init'], {
          cwd: resolve('modules', answers.name),
          detached: true,
          stdio: 'inherit',
        });
      },
      async (answers) => {
        if (answers.install !== true) {
          return;
        }
        console.log('Installing dependencies');
        await spawn$('npm', ['install'], {
          cwd: resolve('modules', answers.name),
          detached: true,
          stdio: 'inherit',
        });
      },
    ],
  });

  // Create the camelize helper
  plop.setHelper('camelize', txt => camelize(txt));
  plop.setHelper('raw-helper', options => options.fn());
};
