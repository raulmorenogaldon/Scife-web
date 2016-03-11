var imagesController = require('../controllers/images.js');

module.exports = function (app) {
	
	app.get('/images', imagesController.list);
	
	app.get('/images/details/:imageId', imagesController.get);
};