var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer,
	domain = JSON.parse(fs.readFileSync(process.argv[2])).domainServer,
	SHA = require("crypto-js/sha512");

exports.index = function (req, res) {
	res.render('index');
};

exports.login = function (req, res) {
	res.render('index/login');
};

exports.signIn = function (req, res) {
	request({
		url: privateServer + '/login',
		method: 'POST',
		headers: [
			{
				name: 'content-type',
				value: 'application/json'
			}
		],
		json: {
			"username": req.body.username,
			"password": SHA(req.body.password)
		}
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			switch (response.statusCode) {
				case 500:
				case 401:
				case 404:
				case 400:
					res.render('index/login', typeof body == 'string' ? JSON.parse(body) : body );
					break;
				case 200:
					res.cookie("token", body.token, { "domain": domain, "expries": 0 });
					res.redirect("/experiments");
					break;
				default:
					res.send("There is no status code from the internal server.");
			}

		}
	});
};