/**
 * Module dependencies.
 */

const ctrls = require('../controllers/checks.server.controller');

module.exports = {
  prefix: '',
  routes: [{
    path: '/ok',
    methods: {
      get: {
        middlewares: [
          ctrls.ok,
        ],
        iam: 'core:checks:ok',
        title: 'Tester si l\'application est accessible',
        description: 'API pour tester si l\'application est accessible',
        affectable: false,
      },
    },
  }],
};
