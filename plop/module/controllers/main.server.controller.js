const { resolve } = require('path');

// eslint-disable-next-line import/no-dynamic-require
const config = require(resolve('config'));
const { vendor } = config.files.server.modules;

/**
 * Test if the module {{name}} is up and running
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 */
exports.ok = async (req, res) => res.render(`${vendor}/{{name}}/views/main`, {
  title: '{{name}}',
  description: req.t('IS_OK'),
  cssFiles: ['https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'],
});
