/**
 * Test if the module {{name}} is up and running
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 */
exports.ok = async (req, res) => res.render('modules/{{name}}/views/main', {
  title: '{{name}}',
  description: req.t('IS_OK'),
  cssFiles: ['https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'],
});
