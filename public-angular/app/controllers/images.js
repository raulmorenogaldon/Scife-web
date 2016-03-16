var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;


exports.get = function(req, res) {

};

exports.list = function(req, res) {
	request({
		url: privateServer + '/cloud/images/',
		methos: 'GET'
	}, function(err, response, body) {
		console.log(response.statusCode + "   " + body);
		if (err) {
			res.status(400).json({
				err: err
			});
		} else {

			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(response.statusCode, {
						err: body.errors
					});
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