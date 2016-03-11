
var users = require('../controllers/users');

module.exports = function (app) {

	app.get('/users', users.list);

	app.get('/users/details/:userId', users.details);

	app.get('/users/create', function (req, res) {
		res.render('users/create');
	});
	app.post('/users/create', users.create);

	app.get('/users/update/:userId', users.getUpdate);
	app.post('/users/update/:userId', users.postUpdate);

	app.get('/login', function (req, res) {
		if (req.session.user) {
			res.redirect('/');
		}
		res.render('users/login', { msg: req.session.msg });
	});
	app.post('/login', users.login);

	app.get('/logout', function (req, res) {
		req.session.destroy(function () {
			res.redirect('/login');
		});
	});

	app.get('/users/delete/:userId', users.getDelete);
	app.post('/users/delete/', users.postDelete);
};