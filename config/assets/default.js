const folders = ['vendor', 'modules'];
const [vendor, ...custom] = folders;

module.exports = {
  modules: {
    vendor,
    custom,
  },
  server: {
    models: [
      `${vendor}/users/models/**/*.js`,
      `${vendor}/!(users)/models/**/*.js`,
      ...custom.map(m => `${m}/*/models/**/*.js`),
    ],
    routes: [
      `${vendor}/!(core)/routes/**/*.js`,
      ...custom.map(m => `${m}/*/routes/**/*.js`),
      `${vendor}/core/routes/**/*.js`,
    ],
    config: [
      `${vendor}/*/config/*.js`,
      ...custom.map(m => `${m}/*/config/*.js`),
    ],
    iam: [
      `${vendor}/*/iam/*.js`,
      ...custom.map(m => `${m}/*/iam/*.js`),
    ],
    bootstraps: [
      `${vendor}/*/bootstraps/*.js`,
      ...custom.map(m => `${m}/*/bootstraps/*.js`),
    ],
    appConfig: [
      `${vendor}/*/app.config.js`,
      ...custom.map(m => `${m}/*/app.config.js`),
    ],
    env: [
      `${vendor}/*/variables.meta.json`,
      ...custom.map(m => `${m}/*/variables.meta.json`),
    ],
    sockets: [
      `${vendor}/*/sockets/**/*.server.socket.js`,
      ...custom.map(m => `${m}/*/sockets/**/*.server.socket.js`),
    ],
    socketsConfig: [
      `${vendor}/*/sockets/**/*.server.socket.config.js`,
      ...custom.map(m => `${m}/*/sockets/**/*.server.socket.config.js`),
    ],
  },
};
