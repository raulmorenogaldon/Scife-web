var ApplicationsController = require('../controllers/applications.js');

module.exports = function (app) {

	app.get('/applications', ApplicationsController.list);
	
	app.get('/applications/details/:applicationId', ApplicationsController.get);
	
	app.get('/applications/create', function (req, res) {
		res.render('applications/create');
	});
	
	app.post('/applications/create', ApplicationsController.create);
	
	app.get('/applications/getjson/:applicationId', ApplicationsController.getApplicationAsJson);
	
	app.get('/applications/getjson/', ApplicationsController.getListAsJson);
};