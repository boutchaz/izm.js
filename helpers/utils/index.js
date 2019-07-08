// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const Ajv = require('ajv');
const { model } = require('mongoose');
const debug = require('debug')('boilerplate:helpers:utils');
const { resolve } = require('path');
const { readFile } = require('fs');
const { promisify } = require('util');

// eslint-disable-next-line import/no-dynamic-require
const sockets = require(resolve('config/lib/socket.io'));

const roleCache = {};
let excludeCache;
const readFile$ = promisify(readFile);

/**
 * Validates a payload with a given schema
 * @param {Object} schema The schema of the payload
 */
exports.validate = schema => async function validateSchema(req, res, next) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    return next();
  }

  return res.status(400).json({
    error: true,
    message: validate.errors,
  });
};

/**
 * Check current user has IAM
 * @param {Object} iam the IAM to check
 */
exports.hasIAM = iam => async function hasIAM(req, res, next) {
  const IAM = model('IAM');
  const { iams } = req;
  let count;

  // Check if the permission exist in data base.
  try {
    count = await IAM.countDocuments({ iam });
  } catch (e) {
    return next(e);
  }
  if (count <= 0) return res.status(404).json({ message: `Permission(IAM) ${iam} not found` });

  // Check if the user has the permission.
  if (iams.find(el => el.iam === iam) === undefined) {
    return res.status(403).json({ message: `You don't have permission ${iam} to continue` });
  }

  return next();
};

/**
 * Gets the base URL of the request
 * @param {IncomingMessage} req The request
 */
exports.getBaseURLFromRequest = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  return `${protocol}://${req.get('host')}`;
};

/**
 * Create a new user that has a specific list of IAMs
 * @param {Object} credentials An object containing the username and the password
 * @param {Array} iams An array of IAM keys to affect to the current user
 * @param {String} name The name of the group to generate
 */
exports.createUser = async (
  credentials = {
    username: 'username',
    password: 'jsI$Aw3$0m3',
  },
  iams = ['users:auth:signin'],
  name = 'role-tests') => {
  const IAM = model('IAM');
  const User = model('User');
  const Role = model('Role');

  const list = await IAM.find({
    iam: {
      $in: iams,
    },
  });
  if (roleCache[name]) {
    await roleCache[name].remove();
  }
  try {
    roleCache[name] = await new Role({
      name,
      iams: list,
    }).save();
  } catch (e) {
    debug(e);
  }

  const user = await new User({
    name: {
      first: 'Full',
      last: 'Name',
    },
    email: `${credentials.username}@example.com`,
    username: credentials.username,
    password: credentials.password,
    provider: 'local',
    roles: [name],
    validations: [{
      type: 'email',
      validated: true,
    }],
  }).save();

  return user;
};

/**
 * Check an IAM if it is exluded or not
 * @param {Object} iam The IAM object
 */
exports.isExcluded = async ({ iam, parents = [] }) => {
  if (!excludeCache) {
    let content = '';
    try {
      content = await readFile$(resolve('.api.exclude'), { encoding: 'utf8' });
    } catch (e) {
      // Ignore, just proceed
    }

    excludeCache = content.split('\n')
      .map(one => one.trim())
      .filter(one => Boolean(one) && !one.startsWith('#'));
  }

  let found = excludeCache.includes(iam);

  if (found) {
    return {
      found: true,
      reason: 'iam',
      data: iam,
    };
  }

  found = excludeCache.find(one => parents.includes(one));

  if (found) {
    return {
      found: true,
      reason: 'parent',
      data: found,
    };
  }

  return {
    found: false,
  };
};

exports.getIO = () => sockets.io;
