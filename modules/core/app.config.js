module.exports = () => {
  const app = {
    title: 'My awesome API',
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
