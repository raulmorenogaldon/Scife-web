var experimentsController = require('../controllers/experiments.js');

module.exports = function (app) {
	
	app.get('/experiments', function(req,res){
		res.render('experiments/index');
	});
	
	app.get('/experiments/getexperiments', experimentsController.getExperiments);
	
	app.get('/experiments/details/:experimentId', experimentsController.get);
	
	app.get('/experiments/create', function (req, res) {
		res.render('experiments/create');
	});
	
	app.post('/experiments/create', experimentsController.create);
	
	app.get('/experiments/update/:experimentId', experimentsController.getUpdate);
	
	app.post('/experiments/update/', experimentsController.postUpdate);
};