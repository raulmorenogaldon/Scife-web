var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer,
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
			res.cookie("token",body.token);
			res.redirect("/experiments");
		}
	});
};