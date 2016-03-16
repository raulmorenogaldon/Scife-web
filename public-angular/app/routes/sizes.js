var sizesCtrl = require('../controllers/sizes.js');

module.exports = function (app) {
	
	app.get('/sizes/list', sizesCtrl.list);
	
	app.get('/sizes/details/:sizeId', sizesCtrl.get);
	
	app.get('/sizes/create', function (req, res) {
		res.render('sizes/create');
	});
	
	app.post('/sizes/create', sizesCtrl.create);
};