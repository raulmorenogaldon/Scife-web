var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

exports.list = function (req, res) {
	request({
		url: privateServer + '/sizes',
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.status(400).json({
				err: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.status(response.statusCode).json(JSON.parse(body.errors));
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
	if (!req.body.name || !req.body.desc || !req.body.cpus || !req.body.ram) {
		res.render('sizes/create', {
			err: "Name, description, CPUs and RAM are required",
			name: req.body.name,
			desc: req.body.desc,
			cpus: req.body.cpus,
			ram: req.body.ram
		});
	} else {
		request({
			url: privateServer + '/createsize',
			method: 'POST',
			json: {
				name: req.body.name,
				desc: req.body.desc,
				cpus: req.body.cpus,
				ram: req.body.ram
			}
		}, function (err, response, body) {
			if (err) {
				res.render('sizes/create', {
					err: err,
					name: req.body.nam,
					desc: req.body.desc,
					cpus: req.body.cpus,
					ram: req.body.ram
				});
			} else {
				switch (response.statusCode) {
					case 500:
					case 404:
					case 400:
						res.render('sizes/create', {
							err: body,
							name: req.body.nam,
							desc: req.body.desc,
							cpus: req.body.cpus,
							ram: req.body.ram
						});
						break;
					case 200:
						res.redirect('/sizes/index');
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
		url: privateServer + '/sizes/' + req.params.sizeId,
		methos: 'GET'
	}, function (err, response, body) {
		if (err) {
			res.render('sizes/details', {
				err: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 404:
				case 400:
					res.render('sizes/details', {
						err: body
					});
					break;
				case 200:
					res.render('sizes/details', {
						size: JSON.parse(body)
					});
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};