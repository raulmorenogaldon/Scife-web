var express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	https = require('https'),
	cookieParser = require('cookie-parser'),
	fs = require('fs');

module.exports = function () {
	//Read the JSON config file passed as a parameter when launch nodejs server
	config = JSON.parse(fs.readFileSync(process.argv[2]));
	var app = express();

	//Check if the execution is in development mode or not to allow the morgan report more or less info of the execution
	if (config.development) {
		app.use(morgan('dev'));
	}
	else if (!config.development) {
		app.use(compress());
	}

	//Load the bodyParser and cookieParser libraries in express
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(cookieParser());

	//Set default folder with the views in jade and set the view engine to jade
	app.set('views', './app/views');
	app.set('view engine', 'jade');

	//Load the routes of the application
	require('../app/routes/index.js')(app);
	require('../app/routes/sizes.js')(app);
	require('../app/routes/images.js')(app);
	require('../app/routes/applications.js')(app);
	app.use('/experiments', require('../app/routes/experiments.js'));//In this case the routes are implemented with the Router object of the express.
	app.use('/executions', require('../app/routes/executions.js'));//In this case the routes are implemented with the Router object of the express.

	//Set the folder where are the public files
	app.use(express.static('./public'));

	//Set the port where the server will be listening requests in HTTP
	app.listen(config.publicHttpServerPort);

	//Sets key.pem and cert.pem to  configure HTTPS. Also, sets the port where the server will be listening requests in HTTP
	https.createServer({
		key: fs.readFileSync('./config/certificates/key.pem'),
		cert: fs.readFileSync('./config/certificates/cert.pem')
	}, app).listen(config.publicHttpsServerPort);

	//Print where the server is listening
	console.log('Server running in the port ' + config.publicHttpServerPort);
	console.log('Secure Server running in the port ' + config.publicHttpsServerPort + ', use https://...');
	return app;
};