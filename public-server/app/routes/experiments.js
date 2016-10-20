var expCtrl = require('../controllers/experiments.js');

/**
 * This functions links the url with the correct methods to respond the resquests in the experiment controller
 */
module.exports = function (app) {
	app.get('/experiments/', function (req, res) {
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

	app.get('/experiments/:experimentId/code', expCtrl.getCode);

	app.post('/experiments/:experimentId/code', expCtrl.saveCode);

	app.delete('/experiments/:experimentId/code', expCtrl.deleteSourceFile);

	app.get('/experiments/:experimentId/src_tree', expCtrl.getSrcTree);

	app.get('/experiments/:experimentId/input_tree', expCtrl.getInputTree);

	app.get('/experiments/:experimentId/output_tree', expCtrl.getOutputTree);

	app.get('/experiments/:experimentId/download', expCtrl.downloadFile);

	app.post('/experiments/:experimentId/input', expCtrl.uploadFile);

	app.delete('/experiments/:experimentId/input', expCtrl.deleteInputFile);
};