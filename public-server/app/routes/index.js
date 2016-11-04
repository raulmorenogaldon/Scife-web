
var ctrl = require('../controllers/index.js');

module.exports = function (app) {
	app.get('/', ctrl.index);
	app.get('/login', ctrl.login);
	app.post('/login', ctrl.signIn);
};