
var User = require('mongoose').model('User'),
	crypto = require('crypto');



exports.list = function (req, res) {
	User.find({}, function (err, users) {
		if (err) {
			res.send("Error in list");
		} else {
			res.render('users/index', { users: users });
		}
	});
};

exports.details = function (req, res) {
	User.findById(req.params.userId, function (err, user) {
		if (err) {
			res.send("Error finding the service");
		} else if (!user) {
			res.send("Error user not found.");
		} else {
			res.render('users/detail', { user: user });
		}
	});
};

exports.create = function (req, res) {
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		userName: req.body.userName,
		password: hashPassword(req.body.password)
	});
	user.save(function (err) {
		if (err) {
			res.send('Error saving the user in the db.');
		} else {
			res.redirect('/users/');
		}
	});
};

exports.getUpdate = function (req, res) {
	var user = User.findById(req.params.userId, function (err, user) {
		if (!user) {
			res.send("Error, user not found.");
		} else if (err) {
			res.send("Error:\n" + err);
		} else {
			res.render('users/update', { user: user });
		}
	});
};

exports.postUpdate = function (req, res) {
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		userName: req.body.userName
	});

	if (req.body.password) {
		user.password = hashPassword(req.body.password);
	}

	User.findByIdAndUpdate(req.body.id, user, function (err, user) {
		if (err) {
			res.send("Error updating the user\n" + err);
		} else {
			res.redirect('/users');
		}
	});
};

exports.login = function (req, res) {
	User.findOne({ userName: req.body.userName })
		.exec(function (err, user) {
			if (!user) {
				res.send('User not found.');
			} else if (user.password === hashPassword(req.body.password.toString())) {
				req.session.regenerate(function () {
					req.session.user = user.id;
					req.session.userName = user.userName;
					req.session.msg = 'Authenticated as ' + user.userName;
					res.redirect('/login');
				});
			} else {
				err = 'Authentication failed.';
			}
			if (err) {
				req.session.regenerate(function () {
					req.session.msg = err;
					res.redirect('/login');
				});
			}
		});
};

exports.postDelete = function (req, res) {
	User.findById(req.body.id, function (err, user) {
		if (err) {
			res.send("Error finding the servicio");
		} else if (!user) {
			res.send("Error user not found.");
		} else {
			user.remove();
			res.redirect('/users');
		}
	});
};

exports.getDelete = function (req, res) {
	User.findById(req.params.userId, function (err, user) {
		if (err) {
			res.send("Error finding the servicio");
		} else if (!user) {
			res.send("Error user not found.");
		} else {
			res.render('users/delete', { user: user });
		}
	});
};

function hashPassword(password) {
	return crypto.createHash('sha512').update(password).digest('base64').toString();
}