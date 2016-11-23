var execCtrl = require('../controllers/executions.js'),
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

router.get('/', execCtrl.list);
router.get('/:executionId', execCtrl.details);
router.delete('/:executionId', execCtrl.delete);
router.get('/:executionId/logs', execCtrl.logs);
router.get('/:executionId/outputtree', execCtrl.getOutputTree);
router.get('/:executionId/download', execCtrl.download);
module.exports = router;