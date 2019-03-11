module.exports = () => {
  const app = {
    title: process.env.APP_TITLE || 'My awesome API',
    description: process.env.APP_DESCRIPTION || 'Application generated with the awesome boilerplate "node-boilerplate"',
    pages: {
      login: '/#/auth',
    },
  };

  return {
    app,
    google: {
      gaId: 'UA-XXXXX-Y',
    },
  };
};
