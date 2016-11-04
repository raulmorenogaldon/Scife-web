var AppsCtrl = require('../controllers/applications.js');

module.exports = function (app) {
	
	app.get('/applications/list',  AppsCtrl.list);
	
	app.get('/applications/details/:applicationId', AppsCtrl.details);
	
};