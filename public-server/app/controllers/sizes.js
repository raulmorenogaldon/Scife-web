var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

/**
 * Method: GET
 * This method return a list of sizes
 */
exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/sizes',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.status(400).json({
				err: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 404:
				case 400:
					res.status(response.statusCode).json(JSON.parse(body.errors));
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
 * This method return a sizes whose ID is passed as a parameter
 */
exports.get = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/sizes/' + req.params.sizeId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('sizes/details', {
				err: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 404:
				case 400:
					res.render('sizes/details', {
						err: body
					});
					break;
				case 200:
					res.render('sizes/details', {
						size: JSON.parse(body)
					});
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};