var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

/** 
 * Method: GET
 * Return a json list with the brief info of the expreiments
*/
exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions' + (req.query.exp ? '?exec='+req.query.exp : ""),
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 404:
				case 400:
					res.status(response.statusCode).json((body));
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
 * Get the details of the experiment as a Json object
 */
exports.details = function (req, res) {
	console.log(privateServer + '/executions/' + req.params.executionId)
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions/' + req.params.executionId,
		method: 'GET'
	}, function (err, response, body) {
			console.log(body)
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
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

exports.delete = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions/' + req.params.executionId,
		method: 'DELETE'
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
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
 * Get a brief info of the experiment and its logs
 */
exports.logs = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions/' + req.params.executionId + "/logs",
		method: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
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

exports.download = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		"url": privateServer + '/experiments/' + req.params.executionId + "/download?file=" + req.query.file
	}).pipe(res);
};

/**
 * Method: GET
 * Get the output tree with the files generated when the experiment is launched
 */
exports.getOutputTree = function (req, res) {
	var url;
	if (req.query.folder && req.query.depth) {
		url = privateServer + '/executions/' + req.params.experimentId + "/outputtree?folder=" + req.query.folder + '&depth=' + req.query.depth;
	} else if (!req.query.folder && req.query.depth) {
		url = privateServer + '/executions/' + req.params.experimentId + "/outputtree?depth=" + req.query.depth;
	} else if (req.query.folder && !req.query.depth) {
		url = privateServer + '/executions/' + req.params.experimentId + "/outputtree?folder=" + req.query.folder;
	} else {
		url = privateServer + '/executions/' + req.params.experimentId + "/outputtree";
	}
	request({
		headers: { "x-access-token": req.cookies.token },
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
				case 401:
					res.status(response.statusCode).json(typeof body == 'string' ? JSON.parse(body) : body);
					break;
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