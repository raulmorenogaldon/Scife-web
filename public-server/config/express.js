var config = require('./config'),
	session = require('express-session'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser');

/*
flash = require('connect-flash'),
passport = require('passport');
*/

module.exports = function () {
	var app = express();
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	}
	else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'jade');

	/*
	//Passport
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
*/

	require('../app/routes/index.js')(app);
	//require('../app/routes/users.js')(app);
	//require('../app/routes/cloud.js')(app);
	require('../app/routes/sizes.js')(app);
	require('../app/routes/images.js')(app);
	require('../app/routes/instances.js')(app);
	require('../app/routes/applications.js')(app);
	require('../app/routes/experiments.js')(app);

	app.use(express.static('./public'));

	app.listen(config.publicServerPort);
	return app;
};