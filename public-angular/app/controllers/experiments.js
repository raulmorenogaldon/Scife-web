var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.getExperiments = function (req, res) {
	request({
		url: privateServer + '/cloud/experiments',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({ errors: err });
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


exports.details = function (req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({ errors: err });
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

exports.create = function (req, res) {
	if (!req.body.name || !req.body.app_id) {
		res.render('experiments/create', { err: "Name and Application Id are required", name: req.body.name, desc: req.body.desc, applicationId: req.body.applicationId, labels: req.body.labels });
	} else {
		request({
			url: privateServer + '/cloud/experiments',
			method: 'POST',
			json: req.body
		}, function (err, response, body) {
			console.log(response.statusCode);
			console.log(JSON.stringify(body));
			if (err) {
				res.status(505).json({ errors: err });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json({ errors: body.errors, experiment: req.body });
						break;
					case 200:
						res.status(response.statusCode).json({ message: "Experiment created sucessfully, ID experiment: " + body });
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};


exports.getUpdate = function (req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			//res.render('experiments/update', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('experiments/update', { err: body });
					break;
				case 200:
					res.render('experiments/update', { experiment: body[0] });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.postUpdate = function (req, res) {
	if (!req.body.id || !req.body.name || !req.body.applicationId) {
		res.render('experiments/update', { err: "Name and Application Id are required", experiment: req.body });
	} else {
		request({
			url: privateServer + '/cloud/experiments/' + req.body.id,
			method: 'PUT',
			json: {
				name: req.body.name,
				desc: req.body.desc,
				app_id: req.body.applicationId,
				labels: req.body.labels
			}
		}, function (err, response, body) {
			if (err) {
				res.render('experiments/update', { err: err, experiment: req.body });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('experiments/update', { errors: body.errors, experiment: req.body });
						break;
					case 200:
						res.redirect('/experiments');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};