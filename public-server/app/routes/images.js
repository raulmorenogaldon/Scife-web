var imgCtrl = require('../controllers/images.js');

module.exports = function (app) {
	app.get('/images/list', imgCtrl.list);
};