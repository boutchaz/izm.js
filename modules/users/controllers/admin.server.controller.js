/* eslint-disable import/no-dynamic-require */

/**
 * Module dependencies.
 */
const path = require('path');
const mongoose = require('mongoose');

const config = require(path.resolve('./config'));
const User = mongoose.model('User');
const errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller'));

/**
 * Read a single user infos
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.read = (req, res) => {
  res.json(req.model.toJSON({
    virtuals: true,
  }));
};

/**
 * Send the profile picture of a specific user
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.picture = (req, res) => {
  res.redirect(req.model.profilePictureUrl);
};

/**
 * Update a User
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.update = async (req, res) => {
  const user = req.model;

  // For security purposes only merge these parameters
  user.name = {
    ...user.name,
    ...req.body.name,
  };

  if (Array.isArray(req.body.roles)) {
    user.roles = req.body.roles;
  }

  try {
    await user.save();
  } catch (e) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(e),
    });
  }

  return res.json(user.toJSON({
    virtuals: true,
  }));
};

/**
 * Delete a user
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.delete = (req, res) => {
  const user = req.model;

  user.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err),
      });
    }

    return res.status(204).end();
  });
};

/**
 * List of Users
 */
exports.list = (req, res) => {
  const private_attrs = config.app.profile.private_attrs || [];
  User
    .find({}, private_attrs.map(attr => `-${attr}`).join(' '))
    .sort('-created')
    .then(users => res.json(users))
    .catch(err => res.status(400).send({
      message: errorHandler.getErrorMessage(err),
    }));
};

/**
 * Get user by ID
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.userByID = (req, res, next, id) => {
  const private_attrs = config.app.profile.private_attrs || [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: req.t('USER_INVALID', {
        id,
      }),
    });
  }

  return User.findById(id, private_attrs.map(attr => `-${attr}`).join(' '))
    .exec((err, user) => {
      if (err) {
        return next(err);
      } if (!user) {
        return next(new Error(req.t('USER_LOAD_FAILED', {
          id,
        })));
      }

      req.model = user;
      return next();
    });
};
