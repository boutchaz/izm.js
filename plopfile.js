function camelize(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}

module.exports = (plop) => {
  // controller generator
  plop.setGenerator('module', {
    description: 'Create new module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Choose a name',
      },
    ],
    actions: [
      {
        type: 'addMany',
        templateFiles: 'plop/module/**/*.(js|json|swig)',
        destination: 'modules/{{name}}',
        skipIfExists: true,
        base: 'plop/module',
      },
    ],
  });

  // Create the camelize helper
  plop.setHelper('camelize', txt => camelize(txt));
  plop.setHelper('raw-helper', options => options.fn());
};
