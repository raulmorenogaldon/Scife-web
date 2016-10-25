var session = require('express-session'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	https = require('https'),
	fs = require('fs');

module.exports = function () {
	config = JSON.parse(fs.readFileSync(process.argv[2]));
	var app = express();

	if (config.development) {
		app.use(morgan('dev'));
	}
	else if (!config.development) {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	
	/*app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	*/

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

	app.listen(config.publicHttpServerPort);

	https.createServer({
		key: fs.readFileSync('./config/certificates/key.pem'),
		cert: fs.readFileSync('./config/certificates/cert.pem')
	}, app).listen(config.publicHttpsServerPort);

	console.log('Server running in the port ' + config.publicHttpServerPort);
	console.log('Secure Server running in the port ' + config.publicHttpsServerPort + ', use https://...');
	return app;
};