const { resolve } = require('path');

// eslint-disable-next-line import/no-dynamic-require
const config = require(resolve('config'));
const { vendor } = config.files.server.modules;

/**
 * Render the main application page
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.renderIndex = (req, res) => {
  res.render(`${vendor}/core/views/index`, {
    user: req.user ? req.user.toJSON({ virtuals: true }) : null,
  });
};

/**
 * Render the server error page
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.renderServerError = (req, res) => {
  res.status(500).render(`${vendor}/core/views/500`, {
    error: 'Oops! Something went wrong...',
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.renderNotFound = (req, res) => {
  res.status(404).format({
    'text/html': () => {
      res.render(`${vendor}/core/views/404`, {
        url: req.originalUrl,
      });
    },
    'application/json': () => {
      res.json({
        error: 'Path not found',
      });
    },
    default() {
      res.send('Path not found');
    },
  });
};
