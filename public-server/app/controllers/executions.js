var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

/** 
 * Method: GET
 * Return a json list with a brief info of the executions whose id is passed as a parameter
*/
exports.list = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions' + (req.query.exp ? '?exp='+req.query.exp : ""),
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
 * Get the details of the execution as a Json object
 */
exports.details = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		url: privateServer + '/executions/' + req.params.executionId,
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

/**
 * Method: DELETE
 * Delete an execution whose id is passed as a parameter
 */
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
 * Get a brief info of the executions and its logs
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

/**
 * Method: GET
 * Download a file of the execution whose path is passed as a parameter
 */
exports.download = function (req, res) {
	request({
		headers: { "x-access-token": req.cookies.token },
		"url": privateServer + '/executions/' + req.params.executionId + "/download?file=" + req.query.file
	}).pipe(res);
};

/**
 * Method: GET
 * Get the output tree with the files generated when the experiment is launched
 */
exports.getOutputTree = function (req, res) {
	var url;
	if (req.query.folder && req.query.depth) {
		url = privateServer + '/executions/' + req.params.executionId + "/outputtree?folder=" + req.query.folder + '&depth=' + req.query.depth;
	} else if (!req.query.folder && req.query.depth) {
		url = privateServer + '/executions/' + req.params.executionId + "/outputtree?depth=" + req.query.depth;
	} else if (req.query.folder && !req.query.depth) {
		url = privateServer + '/executions/' + req.params.executionId + "/outputtree?folder=" + req.query.folder;
	} else {
		url = privateServer + '/executions/' + req.params.executionId + "/outputtree";
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