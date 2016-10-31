var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;


exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.get("x-access-token") },
		url: privateServer + '/applications/',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.status(400).json({ err: err });
		} else {
			switch (response.statusCode) {
				case 500:
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

exports.details = function (req, res) {
	request({
		headers: { "x-access-token": req.get("x-access-token") },
		url: privateServer + '/applications/' + req.params.applicationId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('applications/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
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