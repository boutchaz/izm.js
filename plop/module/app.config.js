const SCOPE = '{{name}}';

module.exports = (config) => {
  const { env } = config.utils;

  return {
    '{{name}}': {
      exampleVar: env.get('EXAMPLE_KEY', SCOPE),
    },
  };
};
