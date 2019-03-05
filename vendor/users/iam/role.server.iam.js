// Controllers
const ctrl = require('../controllers/role.server.controller');

// eslint-disable-next-line
const utils = require('utils');

// validation schemas
const createSchema = require('../schemas/create_role.server.schema.json');
const updateSchema = require('../schemas/update_role.server.schema.json');

module.exports = {
  prefix: '/roles',
  params: [
    {
      name: 'id',
      middleware: ctrl.getById,
    },
  ],
  routes: [
    {
      path: '/',
      methods: {
        get: {
          title: 'Get available roles',
          decription: 'Returns a list of the roles available',
          iam: 'administration:roles:list',
          middlewares: [ctrl.listRoles],
        },
        post: {
          title: 'Create new role',
          description: 'Creates new role with the given permissions',
          iam: 'administration:roles:create',
          middlewares: [
            utils.validate(createSchema),
            ctrl.verifyExisting,
            ctrl.verifyIams,
            ctrl.create,
          ],
        },
      },
    },
    {
      path: '/:id',
      methods: {
        get: {
          title: 'Get a role by id',
          description: 'returns the object of the role',
          iam: 'administration:roles:get',
          middlewares: [ctrl.get],
        },
        put: {
          title: 'Update a role',
          description: 'Updates the role',
          iam: 'administration:roles:update',
          middlewares: [
            utils.validate(updateSchema),
            ctrl.verifyIams,
            ctrl.update,
          ],
        },
      },
    },
  ],
};
