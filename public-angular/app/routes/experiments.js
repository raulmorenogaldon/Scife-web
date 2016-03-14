var experimentsController = require('../controllers/experiments.js');

module.exports = function (app) {
	
	app.get('/experiments/', function(req,res){
		res.render('experiments/index');
	});
	
	app.get('/experiments/list', experimentsController.list);
	
	app.get('/experiments/details/:experimentId', experimentsController.details);
	
	app.post('/experiments/create', experimentsController.create);
	
	app.put('/experiments/:experimentId', experimentsController.update);
	
	/*
	app.post('/experiments/update/:experimentId', experimentsController.postUpdate);
	*/
};