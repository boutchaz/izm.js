// eslint-disable-next-line import/no-unresolved
const { getFromEnv } = require('utils');

module.exports = () => {
  const app = {
    title: getFromEnv('APP_TITLE', 'Node boilerplate API'),
    description: getFromEnv(
      'APP_DESCRIPTION',
      'Application generated with the awesome boilerplate "node-boilerplate"',
    ),
    pages: {
      login: '/#/auth',
    },
  };

  return {
    app,
    google: {
      gaId: getFromEnv('APP_GOOGLE_ID', 'UA-XXXXX-Y'),
    },
  };
};
