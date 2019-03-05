# NodeJS, Express and MongoDB starter

## Table of Content

  * [Getting Started](#getting-started)
  * [Useful Commands](#useful-commands)
  * [VSCode helpers](#vscode-helpers)


## Getting started

```bash
git clone git@gitlab.com:fairlink/back.git new-project
cd new-project
yarn
cp .example.env .env/.development.env
yarn start
```

Edit the `.env` file to set the correct env variables.

## Useful Commands

  * `yarn start` - starts a dev server
  * `yarn nodemon` - starts the server with [nodemon](https://github.com/remy/nodemon)
  * `yarn test` - runs tests with `mocha`
  * `yarn test:watch` - runs tests in watch mode
  * `yarn watch` - runs eslint and tests in watch mode
  * `yarn generate:module [name]` - generate a new module (Optionnally you can give the name in the command line, otherwise you will be prompted to choose a name.)

## VSCode helpers

iam
===

This shortcut will put a definition of new IAM rules in the file.

iam:route
=========

Will generate a new route

iam:method
==========

Will generate the definition of a method.

ctrl
====

Create new controller.

