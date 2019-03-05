const mongoose = require('mongoose');
const debug = require('debug')('helpers:iam');
const pathToRegexp = require('path-to-regexp');

class Iam {
  constructor() {
    this.IamModel = mongoose.model('IAM');
    this.RoleModel = mongoose.model('Role');
  }

  async allow(resource, permission, iam, opts = {}) {
    const { title, description, module } = opts;
    const regex = pathToRegexp(resource).toString();
    const obj = {
      resource: regex.substr(1, regex.length - 3),
      permission,
      iam,
    };

    if (typeof opts.affectable === 'boolean') {
      obj.affectable = opts.affectable;
    }

    if (typeof opts.system === 'boolean') {
      obj.system = opts.system;
    }

    if (typeof title === 'string') {
      obj.title = title;
    }

    if (typeof description === 'string') {
      obj.description = description;
    }

    if (typeof module === 'string') {
      obj.module = module;
    }

    try {
      await this.IamModel.findOneAndUpdate({ iam }, obj, {
        upsert: true,
        setDefaultsOnInsert: true,
      }).catch(() => { });
    } catch (e) {
      debug('Database Error');
    }

    return this;
  }

  async IAMsFromRoles(roles = []) {
    let iams = [];

    try {
      iams = (await this.RoleModel.find({
        name: {
          $in: roles,
        },
      }).populate('iams').select('iams')).map(r => r.iams);

      // Flatten the IAMs
      iams = [].concat(...iams).map(iam => iam.toJSON({
        virtuals: true,
      }));
      // Remove the dupplicates
      iams = iams.filter((iam, pos, arr) => {
        const position = arr.findIndex(one => one.id === iam.id);
        return position === pos;
      });

      return iams;
    } catch (e) {
      return iams;
    }
  }

  async areAnyIamAllowed(iams = [], resource, permission) {
    try {
      const isYes = await this.IamModel.findOne({
        iam: {
          $in: iams,
        },
        resource,
        permission,
      });
      return !!isYes;
    } catch (e) {
      return false;
    }
  }

  async areAnyIamIdAllowed(iamIDs = [], resource, permission) {
    try {
      const isYes = await this.IamModel.findOne({
        _id: {
          $in: iamIDs,
        },
        resource,
        permission,
      });
      return !!isYes;
    } catch (e) {
      return false;
    }
  }

  async areAnyRoleAllowed(roles = [], resource, permission) {
    // Find the IAMs of selected roles
    const iams = await this.IAMsFromRoles(roles);

    // Get IAMs by ID
    const isYes = await this.IamModel.findOne({
      _id: {
        $in: iams,
      },
      resource,
      permission,
    });
    return !!isYes;
  }
}

module.exports = Iam;
