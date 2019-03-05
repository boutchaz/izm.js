/* eslint-disable import/no-dynamic-require */

/**
 * Module dependencies.
 */
const path = require('path');
const multer = require('multer');

const config = require(path.resolve('./config'));
// eslint-disable-next-line
const gridfsStorage = require("gridfs-storage");
const users = require('../controllers/users.server.controller');

module.exports = {
  prefix: '/me',
  routes: [{
    path: '/',
    methods: {
      get: {
        middlewares: [
          users.me,
        ],
        iam: 'users:profile:get',
      },
      post: {
        middlewares: [
          users.update,
        ],
        iam: 'users:profile:edit',
      },
    },
  }, {
    path: '/accounts',
    methods: {
      delete: {
        middlewares: [
          users.removeOAuthProvider,
        ],
        iam: 'users:oauth:remove',
      },
    },
  }, {
    path: '/picture',
    methods: {
      get: {
        middlewares: [
          users.getProfilePicture,
        ],
        iam: 'users:profile:picture:get',
      },
      post: {
        middlewares: [
          multer({
            storage: gridfsStorage({
              resize: config.app.profile.picture.thumbnail,
            }),
            fileFilter: users.profilePictFilter,
            limits: {
              fileSize: 524288, // 512Kb
            },
          }).single('avatar'),
          users.uploadProfilePicture,
        ],
        iam: 'users:profile:picture:update',
      },
    },
  }],
};
