module.exports = {
  server: {
    models: [
      'modules/users/models/**/*.js',
      'modules/!(users)/models/**/*.js',
    ],
    routes: [
      'modules/!(core)/routes/**/*.js',
      'modules/core/routes/**/*.js',
    ],
    config: 'modules/*/config/*.js',
    iam: ['modules/*/iam/*.js'],
    bootstraps: 'modules/*/bootstraps/*.js',
    appConfig: 'modules/*/app.config.js',
  },
};
