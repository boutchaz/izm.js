module.exports = (config) => {
  const { env } = config.utils;
  const app = {
    title: env.get('APP_TITLE'),
    publicAddress: env.get('APP_PUBLIC_ADDRESS') || `http://localhost:${env.get('PORT')}`,
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
