var sizesCtrl = require('../controllers/sizes.js');

module.exports = function (app) {
	app.get('/sizes/list', sizesCtrl.list);
	app.get('/sizes/:sizeId', sizesCtrl.get);
};