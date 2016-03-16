var imgCtrl = require('../controllers/images.js');

module.exports = function (app) {
	
	app.get('/images', imgCtrl.list);
	
	app.get('/images/details/:imageId', imgCtrl.get);
	
	app.get('/images/list', imgCtrl.list);
};