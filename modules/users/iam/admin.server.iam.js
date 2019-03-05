

/**
 * Module dependencies.
 */
const adminCtrls = require('../controllers/admin.server.controller');

module.exports = {
  prefix: '/users',
  params: [{
    name: 'userId',
    middleware: adminCtrls.userByID,
  }],
  routes: [{
    path: '/',
    methods: {
      get: {
        middlewares: [
          adminCtrls.list,
        ],
        iam: 'users:admin:list',
        title: 'List users',
        description: 'Gérer la liste des utilisateurs',
      },
    },
  }, {
    path: '/:userId',
    methods: {
      get: {
        middlewares: [
          adminCtrls.read,
        ],
        iam: 'users:admin:read',
      },
      put: {
        middlewares: [
          adminCtrls.update,
        ],
        iam: 'users:admin:update',
      },
      delete: {
        middlewares: [
          adminCtrls.delete,
        ],
        iam: 'users:admin:delete',
      },
    },
  }, {
    path: '/:userId/picture',
    methods: {
      get: {
        middlewares: [
          adminCtrls.picture,
        ],
        iam: 'users:admin:picture',
      },
    },
  }],
};
