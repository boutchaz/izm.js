/**
 * Module dependencies.
 */

const users = require('../controllers/users.server.controller');

module.exports = {
  prefix: '/auth',
  routes: [
    {
      path: '/forgot',
      methods: {
        post: {
          middlewares: [users.forgot],
          iam: 'users:auth:passwd:forgotten',
        },
      },
    },
    {
      path: '/name',
      methods: {
        get: {
          middlewares: [users.name],
          iam: 'users:auth:name',
        },
      },
    },
    {
      path: '/reset/:token',
      methods: {
        get: {
          middlewares: [users.validateResetToken],
          iam: 'users:auth:passwd:validate-token',
        },
        post: {
          middlewares: [users.reset],
          iam: 'users:auth:passwd:reset',
        },
      },
    },
    {
      path: '/password',
      methods: {
        post: {
          middlewares: [users.changePassword],
          iam: 'users:passwd:change',
        },
      },
    },
    {
      path: '/signup',
      methods: {
        post: {
          middlewares: [users.signup],
          iam: 'users:auth:signup',
        },
      },
    },
    {
      path: '/signin',
      methods: {
        post: {
          middlewares: [users.signin],
          iam: 'users:auth:signin',
        },
      },
    },
    {
      path: '/signout',
      methods: {
        get: {
          middlewares: [users.signout],
          iam: 'users:auth:signout',
        },
      },
    },
    {
      path: '/confirm',
      methods: {
        get: {
          middlewares: [users.confirm],
          iam: 'users:auth:code:confirm',
        },
      },
    },
    {
      path: '/resend',
      methods: {
        get: {
          middlewares: [users.resend],
          iam: 'users:auth:code:resend',
        },
      },
    },
  ],
};
