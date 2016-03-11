var instancesController = require('../controllers/instances.js');

module.exports = function (app) {
	
	app.get('/instances', instancesController.list);
	
	app.get('/instances/details/:instanceId', instancesController.get);
	
	app.get('/instances/create', function (req, res) {
		res.render('instances/create');
	});
	
	app.post('/instances/create', instancesController.create);
};