var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.list = function (req, res) {
	request({
		url: privateServer + '/cloud/instances',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('instances/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('instances/index', { err: body });
					break;
				case 200:
					res.render('instances/index', { instances: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.create = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.imageId || !req.body.sizeId) {
		res.render('instances/create', { err: "Name, description, image id and size id are required", name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
	} else {
		request({
			url: privateServer + '/cloud/createinstance',
			method: 'POST',
			json: {
				name: req.body.name,
				desc: req.body.desc,
				image_id: req.body.imageId,
				size_id: req.body.sizeId
			}
		}, function (err, response, body) {
			if (err) {
				res.render('instances/create', { err: err, name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('instances/create', { err: JSON.parse(body), name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
						break;
					case 200:
						res.redirect('/instances');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.get = function (req, res) {
	request({
		url: privateServer + '/cloud/instances/' + req.params.instanceId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('instances/details', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('instances/details', { err: body });
					break;
				case 200:
					res.render('instances/details', { instance: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};
