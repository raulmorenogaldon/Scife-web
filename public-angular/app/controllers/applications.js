var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;


exports.list = function (req, res) {
	request({
		url: privateServer + '/cloud/applications/',
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
		url: privateServer + '/cloud/applications/' + req.params.applicationId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('applications/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.send(404, "Error reiving the data");
					break;
				case 200:
					res.json(JSON.parse(body)[0]);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.create = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.creationScript || !req.body.executionScript) {
		res.render('experiments/create', { err: "Name, description, creation script and experiment script are required", name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
	} else {
		request({
			url: privateServer + '/cloud/createapplication',
			method: 'POST',
			json: {
				name: req.body.name,
				desc: req.body.desc,
				creation_script: req.body.creationScript,
				execution_script: req.body.executionScript
			}
		}, function (err, response, body) {
			if (err) {
				res.render('applications/create', { err: err, name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('applications/create', { err: JSON.parse(body), name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
						break;
					case 200:
						res.redirect('/applications');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};
