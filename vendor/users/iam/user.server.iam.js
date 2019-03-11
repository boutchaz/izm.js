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
        title: 'Get current user details',
        description: 'API to fetch the current user details',
      },
      post: {
        middlewares: [
          users.update,
        ],
        iam: 'users:profile:edit',
        title: 'Update profile',
        description: 'Update current user details',
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
        title: 'Remove a social network account',
        description: 'API to remove an linked social network account',
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
        title: 'Get current user profile picture',
        description: 'API to fetch the image of the current user',
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
        title: 'Update profile picture',
        description: 'Use this API to upload a new profile picture',
      },
    },
  }],
};
