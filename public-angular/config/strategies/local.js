var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function () {
	//Done is the response function called when this method try autenticate the user
	passport.use(new LocalStrategy(function (userName, password, done) {
		User.findOne({ userName: userName },
			function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user'
					});
				}

				if (!user.authenticate(password)) {
					return done(null, false, { message: 'Invalid password' });
				}

				return done(null, user);
			});
	}));
};