var ApplicationsController = require('../controllers/applications.js');

module.exports = function (app) {

	app.get('/applications', function(req, res){
		res.render('applications/index');
	});
	
	app.get('/applications/list',  ApplicationsController.list);
	
	app.get('/applications/details/:applicationId', ApplicationsController.details);
	
	app.post('/applications/create', ApplicationsController.create);
};