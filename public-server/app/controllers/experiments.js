var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

/** 
 * Method: GET
 * Return a json list with the brief info of the expreiments
*/
exports.list = function (req, res) {
	request({
		url: privateServer + '/experiments',
		method: 'GET'
	}, function (err, response, body) {
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
					//res.status(response.statusCode).json(JSON.parse(body));
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

/**
 * Method: GET
 * Get the details of the experiment as a Json object
 */
exports.details = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

/**
 * Method: GET
 * Get a brief info of the experiment and its logs
 */
exports.logs = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId + "/logs",
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

/**
 * Method: GET
 * Redirect the experiment results from the private server as a stream
 */
exports.downloadResults = function (req, res) {
	request(privateServer + '/experiments/' + req.params.experimentId + "/download").pipe(res);
};

/**
 * Method: POST
 * Get the create experiment request with the basic data to create a new experiment.
 */
exports.create = function (req, res) {
	if (!req.body.name || !req.body.app_id) {
		res.status(404).json({
			message: "Name and Application are required."
		});
	} else {
		request({
			url: privateServer + '/experiments',
			method: 'POST',
			json: req.body
		}, function (err, response, body) {
			if (err) {
				res.status(505).json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: PUT
 * Get the data to update the info of an experiment
 */
exports.update = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId,
		method: 'PUT',
		json: req.body
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: PUT
 * Get the request to launch an experiment.
 */
exports.launch = function (req, res) {
	var data = req.body;
	if (!data.nodes || !data.image_id || !data.size_id) {
		res.status(404).json({
			errors: "Nodes, image and size are required."
		});
	} else {
		data.op = "launch";
		request({
			url: privateServer + '/experiments/' + req.params.experimentId,
			method: 'POST',
			json: data
		}, function (err, response, body) {
			if (err) {
				res.status(505).json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: POST
 * Get the request to reset the experiment execution.
 */
exports.reset = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId,
		method: 'POST',
		json: {
			op: 'reset'
		}
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: DELETE
 * Get the request to delete an experiment by ID.
 */
exports.delete = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId,
		method: 'DELETE'
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: GET
 * Return the file code asked by the path of the file.
 */
exports.getCode = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId + "/code?file=" + req.query.fileId,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

/**
 * Method: POST
 * Save a file pased as text-plain in the body, this file will be saved in the path indicated by the "file"" var. This method also serves to create a folder in the path indicated by the "file" var, to create a folder, the path must finish with a slash "/", if not, then a file will be created.
 */
exports.saveCode = function (req, res) {
	//Check if the user wants to create a folder (path ends with '/')
	if (req.query.fileId.slice(-1) == '/') {
		request({
			url: privateServer + '/experiments/' + req.params.experimentId + "/code?file=" + req.query.fileId,
			method: 'POST'
		}, function (err, response, body) {
			if (err) {
				res.json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
						break;
					case 200:
						res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	} else {
		var data = '';
		if (req.is('text/*')) {
			req.setEncoding('utf8');
			req.on('data', function (chunk) {
				data += chunk;
			});
			req.on('end',
				function () {
					request({
						url: privateServer + '/experiments/' + req.params.experimentId + "/code?file=" + req.query.fileId,
						method: 'POST',
						headers: {
							'content-type': 'text/plain'
						},
						body: data
					}, function (err, response, body) {
						if (err) {
							res.json({
								errors: err
							});
						} else {
							switch (response.statusCode) {
								case 500:
								case 404:
								case 400:
									res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
									break;
								case 200:
									res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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
	}
};

/**
 * Method: GET
 * Get the experiment brief info and the sources tree as a JSon object.
 */
exports.getSrcTree = function (req, res) {
	var url;
	if (req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/srctree?folder=" + req.query.folder + '&depth=' + req.query.depth;
	} else if (!req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/srctree?depth=" + req.query.depth;
	} else if (req.query.folder && !req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/srctree?folder=" + req.query.folder;
	} else {
		url = privateServer + '/experiments/' + req.params.experimentId + "/srctree";
	}

	request({
		url: url,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

/**
 * Method: GET
 * Get the experiment brief info and the input tree as a JSon object.
 */
exports.getInputTree = function (req, res) {
	var url;
	if (req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/inputtree?folder=" + req.query.folder + '&depth=' + req.query.depth;
	} else if (!req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/inputtree?depth=" + req.query.depth;
	} else if (req.query.folder && !req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/inputtree?folder=" + req.query.folder;
	} else {
		url = privateServer + '/experiments/' + req.params.experimentId + "/inputtree";
	}
	request({
		url: url,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.getOutputTree = function (req, res) {
	var url;
	if (req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/outputtree?folder=" + req.query.folder + '&depth=' + req.query.depth;
	} else if (!req.query.folder && req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/outputtree?depth=" + req.query.depth;
	} else if (req.query.folder && !req.query.depth) {
		url = privateServer + '/experiments/' + req.params.experimentId + "/outputtree?folder=" + req.query.folder;
	} else {
		url = privateServer + '/experiments/' + req.params.experimentId + "/outputtree";
	}
	request({
		url: url,
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.downloadFile = function (req, res) {
	request(privateServer + '/experiments/' + req.params.experimentId + "/download?file="+req.query.file).pipe(res);
};

/**
 * Method: POST
 * This method sends a file to te private server as a stream.
 */
exports.uploadFile = function (req, res) {
	req.pipe(request({
		url: privateServer + '/experiments/' + req.params.experimentId + "/input?file=" + req.query.file,
		method: 'POST'
	},
		function (err, response, body) {
			if (err) {
				res.json({
					errors: err
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.status(response.statusCode).end();
						break;
					case 200:
						res.status(response.statusCode).end();
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		}));
};

exports.deleteInputFile = function (req, res) {
	console.log(privateServer + '/experiments/' + req.params.experimentId + '/input?file=' + req.query.file);
	request({
		url: privateServer + '/experiments/' + req.params.experimentId + '/input?file=' + req.query.file,
		method: 'DELETE'
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
				console.log(body);
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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

exports.deleteSourceFile = function (req, res) {
	request({
		url: privateServer + '/experiments/' + req.params.experimentId + '/code?file=' + req.query.file,
		method: 'DELETE'
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
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