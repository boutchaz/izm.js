/* eslint-disable no-console */

/**
 * Module dependencies.
 */
const config = require('..');
const mongoose = require('./mongoose');
const express = require('./express');
const chalk = require('chalk');
const debug = require('debug')('config:lib:app');

mongoose.loadModels();

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(async (db) => {
    // Initialize express
    const app = await express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  this.init((app, db) => {
    // Start the app by listening on <port>
    app.listen(config.port, () => {
      // Logging initialization
      debug('--');
      debug(chalk.green(`Environment:\t\t\t${process.env.NODE_ENV}`));
      debug(chalk.green(`Port:\t\t\t\t${config.port}`));
      debug(chalk.green(`Database:\t\t\t${config.db.uri}`));
      if (process.env.NODE_ENV === 'secure') {
        debug(chalk.green('HTTPs:\t\t\t\ton'));
      }
      debug(chalk.green(`App version:\t\t\t${config.pkg.version}`));
      debug('--');

      if (callback) callback(app, db, config);
    });
  });
};
