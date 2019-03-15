/* eslint-disable import/no-dynamic-require */

/**
 * Module dependencies.
 */
const { resolve } = require('path');
const mongoose = require('mongoose');

const config = require(resolve('./config'));
const User = mongoose.model('User');

const { vendor } = config.files.server.modules;

const errorHandler = require(resolve(`./${vendor}/core/controllers/errors.server.controller`));

/**
 * Read a single user infos
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.read = async function read(req, res) {
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
exports.picture = async function picture(req, res) {
  res.redirect(req.model.profilePictureUrl);
};

/**
 * Update a User
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.update = async function update(req, res) {
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
exports.delete = async function remove(req, res) {
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
exports.list = async function list(req, res) {
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
exports.userByID = async function userByID(req, res, next, id) {
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
