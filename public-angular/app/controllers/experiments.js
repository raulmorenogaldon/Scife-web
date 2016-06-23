var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.list = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments',
		method: 'GET'
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


exports.details = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		method: 'GET'
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

exports.logs = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/logs",
		method: 'GET'
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
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				case 200:
					res.status(response.statusCode).json(JSON.parse(body).logs);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.downloadResults = function(req, res) {
	//console.log(privateServer + '/cloud/experiments/' + req.params.experimentId + "/download");
	request(privateServer + '/cloud/experiments/' + req.params.experimentId + "/download").pipe(res);
	//res.pipe(request(privateServer + '/cloud/experiments/' + req.params.experimentId + "/download"));
	/*
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/download",
		method: 'GET'
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
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				case 200:
					res.pipe(response);
					response.pipe(res);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
*/
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
						res.status(response.statusCode).json(JSON.parse(body));
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
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				case 200:
					res.status(response.statusCode).end();
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
						res.status(response.statusCode).json(JSON.parse(body));
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
					res.status(response.statusCode).json(JSON.parse(body));
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


exports.delete = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId,
		method: 'DELETE'
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
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				case 200:
					res.status(response.statusCode).end();
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.getFile = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/code?file=" + req.query.fileId,
		method: 'GET'
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
					res.status(response.statusCode).json(JSON.parse(body));
					break;
				case 200:
					res.status(response.statusCode).json(body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.saveFile = function(req, res, next) {
	var data = '';
	if (req.is('text/*')) {
		req.setEncoding('utf8');
		req.on('data', function(chunk) {
			data += chunk;
		});
		req.on('end',
			function() {
				request({
					url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/code?file=" + req.query.fileId,
					method: 'POST',
					headers: {
						'content-type': 'text/plain'
					},
					body: data
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
								res.status(response.statusCode).json(JSON.parse(body));
								break;
							case 200:
								res.status(response.statusCode).json(body);
								break;
							default:
								res.send("There is no status code from the internal server.");
						}
					}
				});
			});
	} else {
		res.status(400).json({
			'errors': {
				message: 'Required Content-Type text/plain.'
			}
		});
	}
};

exports.getSrcTree = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/srctree",
		method: 'GET'
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

exports.getInputTree = function(req, res) {
	request({
		url: privateServer + '/cloud/experiments/' + req.params.experimentId + "/inputtree",
		method: 'GET'
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