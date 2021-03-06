var expCtrl = require('../controllers/experiments.js'),
	router = require('express').Router();

/**
 * This function check the user has the cookie with the token acces, if he has not the function redirect the user to the login view and set the "url" query with the URL the user tried tp access
 */
router.use(function (req, res, next) {
	if (req.cookies) {
		if (!req.cookies.token) {
			res.redirect('/login?url=' + req.originalUrl);
		}
		else {
			next();
		}
	} else {
		next();
	}
});

router.get('/', function (req, res) {
	res.render('experiments/index');
});
router.get('/list', expCtrl.list);
router.get('/:experimentId', expCtrl.details);
router.get('/:experimentId/logs', expCtrl.logs);
router.get('/:experimentId/downloadresults', expCtrl.downloadResults);
router.post('/create', expCtrl.create);
router.put('/:experimentId', expCtrl.update);
router.post('/:experimentId/launch', expCtrl.launch);
router.post('/:experimentId/reset', expCtrl.reset);
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
router.get('/:experimentId/executions', expCtrl.executions);
module.exports = router;