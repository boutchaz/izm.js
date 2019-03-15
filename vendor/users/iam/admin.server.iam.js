

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
        title: 'Get user',
        description: 'Get a specific user using his `id`',
      },
      put: {
        middlewares: [
          adminCtrls.update,
        ],
        iam: 'users:admin:update',
        title: 'Update an existing user',
        description: 'Update a specific user using his identifier',
      },
      delete: {
        middlewares: [
          adminCtrls.delete,
        ],
        iam: 'users:admin:delete',
        title: 'Remove an existing user',
        description: 'Remove a specific user using his identifier',
      },
    },
  }, {
    path: '/:userId/picture',
    methods: {
      get: {
        middlewares: [
          adminCtrls.picture,
          adminCtrls.svg({ size: 46, color: '#d35400', fill: '#ffffff' }),
        ],
        iam: 'users:admin:picture',
        title: 'Get user profile picture',
        description: 'Get the profile picture of an existing using his identifier',
      },
    },
  }],
};
