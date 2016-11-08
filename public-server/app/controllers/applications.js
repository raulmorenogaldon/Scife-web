var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

/**
 * Method: GET
 * This function returns all the applications
 */
exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/applications/',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.status(400).json({ err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 404:
				case 400:
					res.status(response.statusCode).json(response.statusCode, { err: body.errors });
					break;
				case 200:
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

/**
 * Method: GET
 * This function return the info of the application whose ID is passed by parameter
 */
exports.details = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/applications/' + req.params.applicationId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('applications/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 404:
				case 400:
					res.status(response.statusCode).json({ errors: body });
					break;
				case 200:
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};