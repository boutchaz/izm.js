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
          title: 'Reset the user password',
          description: 'Generate a reset password token and send it to the user',
        },
      },
    },
    {
      path: '/name',
      methods: {
        get: {
          middlewares: [users.name],
          iam: 'users:auth:name',
          title: 'Get the user fullname',
          description: 'API to get the current user fullname',
        },
      },
    },
    {
      path: '/reset/:token',
      methods: {
        get: {
          middlewares: [users.validateResetToken],
          iam: 'users:auth:passwd:validate-token',
          title: 'Change password',
          description: 'Redirect the user to the right page to change his password',
        },
        post: {
          middlewares: [users.reset],
          iam: 'users:auth:passwd:reset',
          title: 'Change the password',
          description: 'Change a user password using a valid reset password token',
        },
      },
    },
    {
      path: '/password',
      methods: {
        post: {
          middlewares: [users.changePassword],
          iam: 'users:passwd:change',
          title: 'Change current user password',
          description: 'API to change the current user password',
        },
      },
    },
    {
      path: '/signup',
      methods: {
        post: {
          middlewares: [users.signup],
          iam: 'users:auth:signup',
          title: 'Signup',
          description: 'Sign up a new user',
        },
      },
    },
    {
      path: '/signin',
      methods: {
        post: {
          middlewares: [users.signin],
          iam: 'users:auth:signin',
          title: 'Signin',
          description: 'Sign in an existing user',
        },
      },
    },
    {
      path: '/signout',
      methods: {
        get: {
          middlewares: [users.signout],
          iam: 'users:auth:signout',
          title: 'Signout',
          description: 'Signout the current user',
        },
      },
    },
    {
      path: '/confirm',
      methods: {
        get: {
          middlewares: [users.confirm],
          iam: 'users:auth:code:confirm',
          title: 'Confirm code',
          description: 'Confirm an automatically generated code',
        },
      },
    },
    {
      path: '/resend',
      methods: {
        get: {
          middlewares: [users.resend],
          iam: 'users:auth:code:resend',
          title: 'Resend code',
          description: 'Resend an automatically generated code',
        },
      },
    },
  ],
};
