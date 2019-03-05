// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const _ = require('lodash');
const Ajv = require('ajv');
const mongoose = require('mongoose');

const IAM = mongoose.model('IAM');

exports.changePosition = (arr, old_index, new_index) => {
  let new_arr = [];
  if (Array.isArray(arr) && typeof (old_index) === 'number' && typeof (new_index) === 'number') {
    if (old_index >= 0
      && old_index < arr.length
      && new_index >= 0
      && new_index < arr.length
      && old_index !== new_index) {
      new_arr = _.clone(arr);
      new_arr.splice(new_index, 0, new_arr.splice(old_index, 1)[0]);
    }
  }
  return new_arr;
};

/**
 * Validates a payload with a given schema
 * @param {Object} schema The schema of the payload
 */
exports.validate = schema => (req, res, next) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (validate(req.body)) {
    return next();
  }
  // return next(new Error(JSON.stringify(validate.errors)));
  return res.status(400).json({
    error: true,
    message: new Error(JSON.stringify(validate.errors)),
  });
};


/**
 * Check current user has IAM
 * @param {Object} iam the IAM to check
 */
exports.hasIAM = iam => async (req, res, next) => {
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
 * Select Attributs
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next The callback
 */
exports.select = (req, res, next) => {
  const query = req.query.$select;
  if (query) {
    const selection = query
      .split(',')
      .filter(attr => ['owner.salt', 'owner.secret_key', 'private_attrs'].indexOf(attr) < 0);
    if (selection.length > 0) {
      req.$query = req.$query.select(selection.join(' '));
    }
  }
  return next();
};

/**
 * Expand Attributs
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next The callback
 */
exports.expand = (select1, select2, sort1, sort2) => (req, res, next) => {
  const exp = req.query.$expand;
  if (exp) {
    const expArray = exp.split(',');
    expArray.forEach((element) => {
      if (!element.includes('.')) {
        req.$query = req.$query.populate({
          path: element,
          select: select1,
          options: { sort: sort1 },
        });
      } else {
        const expArray2 = element.split('.');
        req.$query = req.$query.populate({
          path: expArray2[0],
          populate: { path: expArray2[1], select: select2, options: { sort: sort2 } },
          select: select1,
          options: { sort: sort1 },
        });
      }
    });
  }
  return next();
};

/**
 * Execution of contract
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next The callback
 */
exports.exec = (withpagination = false) => async (req, res, next) => {
  let result;
  if (withpagination) {
    const { query } = req;
    const { $skip: skip, $top: top } = query;
    try {
      result = await req.$query.paginate({ top, skip });
    } catch (e) {
      return next(e);
    }
  } else {
    try {
      result = await req.$query.exec();
    } catch (e) {
      return next(e);
    }
  }
  return res.status(200).json(result);
};
