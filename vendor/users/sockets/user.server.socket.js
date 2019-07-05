const Iam = require('../helpers/iam.server.helper');

// Create the chat configuration
module.exports = (io) => {
  const iam = new Iam();

  io.use(async (s, next) => {
    const { request: req } = s;
    const roles = req.user && Array.isArray(req.user.roles) ? req.user.roles : ['guest'];

    try {
      req.iams = await iam.IAMsFromRoles(roles);
      req.iams = req.iams.map(item => ({ ...item, resource: new RegExp(item.resource, 'i') }));
    } catch (e) {
      return next(e);
    }

    return next();
  });
};
