var request = require('request'),
	privateServer = require('../../config/env/development.js').privateServer;

exports.login = function (req, res) {
	request({
		url: privateServer + '/cloud/login',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/index', { result: body.result });
		}
	});
};

exports.listSizes = function (req, res) {
	request({
		url: privateServer + '/cloud/sizes',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/sizes/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/sizes/index', { err: body });
					break;
				case 200:
					res.render('cloud/sizes/index', { sizes: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.listInstances = function (req, res) {
	request({
		url: privateServer + '/cloud/instances',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/instances/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/instances/index', { err: body });
					break;
				case 200:
					res.render('cloud/instances/index', { instances: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.listImages = function (req, res) {
	request({
		url: privateServer + '/cloud/images',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/images/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/images/index', { err: body });
					break;
				case 200:
					res.render('cloud/images/index', { images: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.listApplications = function (req, res) {
	request({
		url: privateServer + '/cloud/applications',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/applications/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/applications/index', { err: body });
					break;
				case 200:
					res.render('cloud/applications/index', { applications: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.listExperiments = function (req, res) {
	request({
		url: privateServer + '/cloud/experiments',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/experiments/index', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/experiments/index', { err: body });
					break;
				case 200:
					res.render('cloud/experiments/index', { experiments: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.createSize = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.cpus || !req.body.ram) {
		res.render('cloud/sizes/create', { err: "Name, description, CPUs and RAM are required", name: req.body.name, desc: req.body.desc, cpus: req.body.cpus, ram: req.body.ram });
	} else {
		request({
			url: privateServer + '/cloud/createsize',
			method: 'POST',
			json: {
				name: req.body.name,
				desc: req.body.desc,
				cpus: req.body.cpus,
				ram: req.body.ram
			}
		}, function (err, response, body) {
			if (err) {
				res.render('cloud/sizes/create', { err: err, name: req.body.nam, desc: req.body.desc, cpus: req.body.cpus, ram: req.body.ram });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('cloud/sizes/create', { err: body, name: req.body.nam, desc: req.body.desc, cpus: req.body.cpus, ram: req.body.ram });
						break;
					case 200:
						res.redirect('/cloud/sizes/index');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.createInstance = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.imageId || !req.body.sizeId) {
		res.render('cloud/instances/create', { err: "Name, description, image id and size id are required", name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
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
				res.render('cloud/instances/create', { err: err, name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('cloud/instances/create', { err: JSON.parse(body), name: req.body.name, desc: req.body.desc, imageId: req.body.imageId, sizeId: req.body.sizeId });
						break;
					case 200:
						res.redirect('/cloud/instances');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.createApplication = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.creationScript || !req.body.executionScript) {
		res.render('cloud/experiments/create', { err: "Name, description, creation script and experiment script are required", name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
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
				res.render('cloud/experiments/create', { err: err, name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('cloud/createApplication', { err: JSON.parse(body), name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
						break;
					case 200:
						res.redirect('/cloud/applications');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.createExperiment = function (req, res) {
	if (!req.body.name || !req.body.desc || !req.body.creationScript || !req.body.executionScript) {
		res.render('cloud/experiments/create', { err: "Name, description, creation script and experiment script are required", name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
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
				res.render('cloud/experiments/create', { err: err, name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('cloud/experiments/create', { err: JSON.parse(body), name: req.body.name, desc: req.body.desc, creationScript: req.body.creationScript, executionScript: req.body.executionScript });
						break;
					case 200:
						res.redirect('/cloud/experiments');
						break;
					default:
						res.send("There is no status code from the internal server.");
				}
			}
		});
	}
};

exports.getSize = function (req, res) {
	request({
		url: privateServer + '/cloud/sizes/' + req.params.sizeId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/sizes/details', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/sizes/details', { err: body });
					break;
				case 200:
					res.render('cloud/sizes/details', { size: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.getInstance = function (req, res) {
	request({
		url: privateServer + '/cloud/instances/' + req.params.instanceId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('cloud/instances/details', { err: err });
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('cloud/instances/details', { err: body });
					break;
				case 200:
					res.render('cloud/instances/details', { instance: JSON.parse(body) });
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};

exports.getImage = function (req, res) {

};

exports.getApplication = function (req, res) {

};

exports.getExperiment = function (req, res) {

};