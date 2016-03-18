var expCtrl = require('../controllers/experiments.js');

module.exports = function(app) {

	app.get('/experiments/', function(req, res) {
		res.render('experiments/index');
	});

	app.get('/experiments/list', expCtrl.list);

	app.get('/experiments/details/:experimentId', expCtrl.details);

	app.post('/experiments/create', expCtrl.create);

	app.put('/experiments/:experimentId', expCtrl.update);

	app.post('/experiments/launch/:experimentId', expCtrl.launch);

	app.post('/experiments/reset/:experimentId', expCtrl.reset);
	
	app.delete('/experiments/:experimentId', expCtrl.delete);
};