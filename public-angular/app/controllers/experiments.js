var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.list = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments',
		methos: 'GET'
	}, function(err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json({
						errors: body
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


exports.details = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		methos: 'GET'
	}, function(err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json({
						errors: body
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

exports.create = function(req, res) {
	if (!req.body.name || !req.body.app_id) {
		res.status(404).json({
			message: "Name and Application are required."
		});
	} else {
		request({
			url: privateServer + '/cloud/experiments',
			method: 'POST',
			json: req.body
		}, function(err, response, body) {
			if (err) {
				res.status(505).json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json({
							errors: body.errors,
							experiment: req.body
						});
						break;
					case 200:
						res.status(response.statusCode).json({
							message: "Experiment created sucessfully, ID experiment: " + body.id,
							experimentId: body.id
						});
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.update = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		method: 'PUT',
		json: req.body
	}, function(err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json({
						errors: body.errors,
						experiment: req.body
					});
					break;
				case 200:
					res.status(response.statusCode).json({
						message: "Experiment updated sucessfully, ID experiment: " + body
					});
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.launch = function(req, res) {
	var data = req.body;
	if (!data.nodes || !data.image_id || !data.size_id) {
		res.status(404).json({
			errors: "Nodes, image and size are required."
		});
	} else {
		data.op = "launch";
		request({
			url: privateServer + '/cloud/experiments/' + req.params.experimentId,
			method: 'POST',
			json: data
		}, function(err, response, body) {
			if (err) {
				res.status(505).json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json({
							errors: body.errors
						});
						break;
					case 200:
						res.status(response.statusCode).json({
							message: "Experiment launched sucessfully."
						});
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.reset = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		method: 'POST',
		json: {
			op: 'reset'
		}
	}, function(err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json({
						errors: body.errors
					});
					break;
				case 200:
					res.status(response.statusCode).json({
						message: "Experiment reset sucessfully."
					});
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};