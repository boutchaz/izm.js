const mongoose = require('mongoose');

const Role = mongoose.model('Role');
const IAM = mongoose.model('IAM');

/**
 * fetch the Role by Id
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.getById = async (req, res, next, id) => {
  let role;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json('Invalid ID');
  }

  try {
    role = await Role.findOne({ _id: id });
  } catch (e) {
    return next(e);
  }

  if (role === null) return res.status(404).json('not found');

  req.role = role;

  return next();
};

/**
 * Returns the Role by id
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.get = async (req, res) => {
  const { role } = req;

  if (role === undefined) return res.status(404).json('not found');

  return res.status(200).json(role);
};

/**
 * List all the roles
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.listRoles = async (req, res, next) => {
  let roles = [];

  try {
    roles = await Role.find({}, 'name');
  } catch (e) {
    return next(e);
  }

  const count = roles.length;

  roles = roles.slice(0, 10);

  return res.status(200).json({
    values: roles,
    count,
    top: 10,
    skip: 0,
  });
};

/**
 * Verify existing role
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.verifyExisting = async (req, res, next) => {
  const { name } = req.body;

  let exists = [];
  try {
    exists = await Role.find({ name });
  } catch (e) {
    return next(e);
  }

  if (exists.length !== 0) return res.status(400).json('Already exists');
  return next();
};

/**
 * Verify Iams
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.verifyIams = async (req, res, next) => {
  const { iams: permissions } = req.body;

  // filter the valid object ids

  if (permissions === undefined) {
    return next();
  }

  let iams = [];

  iams = permissions.filter(el => mongoose.Types.ObjectId.isValid(el));

  // filter existing ACLs
  try {
    iams = await IAM.find({
      _id: {
        $in: iams,
      },
      affectable: true,
    });
  } catch (e) {
    return next(e);
  }

  if (iams.length < 0) return next();

  iams = iams.map(el => el.id);
  req.roleIams = iams;

  return next();
};

/**
 * Creates new role
 */
exports.create = async (req, res, next) => {
  const { roleIams, body } = req;
  const { name, title, description } = body;

  let createdRole;
  try {
    createdRole = new Role({
      name,
      title,
      description,
      roleIams,
    });
    createdRole = await createdRole.save({ new: true });
  } catch (e) {
    return next(e);
  }

  return res.status(200).json(createdRole);
};

/**
 * Edit a role
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.update = async (req, res, next) => {
  const { roleIams, body } = req;
  const { title, description, name } = body;
  let { role } = req;

  if (name !== undefined) role.name = name;
  if (title !== undefined) role.title = title;
  if (description !== undefined) role.description = description;
  if (roleIams !== undefined) role.iams = roleIams;

  try {
    role = await role.save({ new: true });
  } catch (e) {
    return next(e);
  }

  return res.status(200).json(role);
};
