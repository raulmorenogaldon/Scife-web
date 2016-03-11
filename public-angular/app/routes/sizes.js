var sizesController = require('../controllers/sizes.js');

module.exports = function (app) {
	
	app.get('/sizes', sizesController.list);
	
	app.get('/sizes/details/:sizeId', sizesController.get);
	
	app.get('/sizes/create', function (req, res) {
		res.render('sizes/create');
	});
	
	app.post('/sizes/create', sizesController.create);
};