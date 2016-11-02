var expCtrl = require('../controllers/experiments.js'),
	router = require('express').Router();

/**
 * This functions links the url with the correct methods to respond the resquests in the experiment controller
 */
router.use(function (req, res, next) {
	if (req.cookies) {
		if (!req.cookies.token) res.redirect('/login');
	}
	next();
});

router.get('/', function (req, res) {
	res.render('experiments/index');
});

router.get('/list', expCtrl.list);

router.get('/details/:experimentId', expCtrl.details);

router.get('/logs/:experimentId', expCtrl.logs);

router.get('/downloadresults/:experimentId', expCtrl.downloadResults);

router.post('/create', expCtrl.create);

router.put('/:experimentId', expCtrl.update);

router.post('/launch/:experimentId', expCtrl.launch);

router.post('/reset/:experimentId', expCtrl.reset);

router.delete('/:experimentId', expCtrl.delete);

router.get('/:experimentId/code', expCtrl.getCode);

router.post('/:experimentId/code', expCtrl.saveCode);

router.delete('/:experimentId/code', expCtrl.deleteSourceFile);

router.get('/:experimentId/src_tree', expCtrl.getSrcTree);

router.get('/:experimentId/input_tree', expCtrl.getInputTree);

router.get('/:experimentId/output_tree', expCtrl.getOutputTree);

router.get('/:experimentId/download', expCtrl.downloadFile);

router.post('/:experimentId/input', expCtrl.uploadFile);

router.delete('/:experimentId/input', expCtrl.deleteInputFile);
module.exports = router;