var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.list = function (req, res) {
	request({
		url: privateServer + '/cloud/images',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('images/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('images/index', { err: body });
					break;
				case 200:
					res.render('images/index', { images: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.get = function (req, res) {

};
