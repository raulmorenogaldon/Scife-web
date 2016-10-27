var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer;

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
		json: req.body
	}, function (err, response, body) {
		if (err) {
			res.status(505).json({
				errors: err
			});
		} else {
			console.log(body);
		}
	});
};