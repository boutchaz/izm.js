module.exports = (config) => {
  const { env } = config.utils;
  const app = {
    title: env.get('APP_TITLE'),
    description: env.get('APP_DESCRIPTION'),
    pages: {
      login: '/#/auth',
    },
  };

  return {
    app,
    google: {
      gaId: env.get('APP_GOOGLE_ID'),
    },
  };
};
