/**
 * Module dependencies.
 */
const appModulePath = require('app-module-path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: './.env/.common.env',
});

dotenv.config({
  path: `./.env/.${env}.env`,
});

/**
 * Add app modules
 */
[
  'helpers',
  'vendor',
].map(m => appModulePath.addPath(m));
