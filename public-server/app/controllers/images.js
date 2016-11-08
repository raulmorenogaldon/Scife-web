var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;;

/**
 * Method: GET
 * This method get a list with the images
 */
exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/images/',
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
					res.status(response.statusCode).json(JSON.parse(body));
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