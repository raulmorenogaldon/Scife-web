var expCtrl = require('../controllers/experiments.js');

module.exports = function(app) {

	app.get('/experiments/', function(req, res) {
		res.render('experiments/index');
	});

	app.get('/experiments/list', expCtrl.list);

	app.get('/experiments/details/:experimentId', expCtrl.details);
	
	app.get('/experiments/logs/:experimentId', expCtrl.logs);
	
	app.get('/experiments/downloadresults/:experimentId', expCtrl.downloadResults);

	app.post('/experiments/create', expCtrl.create);

	app.put('/experiments/:experimentId', expCtrl.update);

	app.post('/experiments/launch/:experimentId', expCtrl.launch);

	app.post('/experiments/reset/:experimentId', expCtrl.reset);
	
	app.delete('/experiments/:experimentId', expCtrl.delete);
	
	app.get('/experiments/:experimentId/file', expCtrl.getFile);
	
	app.get('/experiments/:experimentId/src_tree', expCtrl.getSrcTree);
	
	app.get('/experiments/:experimentId/input_tree', expCtrl.getInputTree);
};