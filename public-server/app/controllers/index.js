var request = require('request'),
	fs = require('fs'),
	privateServer = JSON.parse(fs.readFileSync(process.argv[2])).privateServer,
	domain = JSON.parse(fs.readFileSync(process.argv[2])).domainServer,
	SHA = require("crypto-js/sha512");

/**
 * Method: GET
 * This method render the main view (index)
 */
exports.index = function (req, res) {
	res.render('index');
};

/**
 * Method: GET
 * This method render the login view to allow the user sign in
 */
exports.login = function (req, res) {
	res.render('index/login');
};

/**
 * Method: POST
 * This function gets the credentials sent them to the private server to check the identity of the user. The password is encrypted with the SHA512 algorithm
 */
exports.signIn = function (req, res) {
	request({
		headers: [
			{
				name: 'content-type',
				value: 'application/json'
			}
		],
		url: privateServer + '/login',
		method: 'POST',
		json: {
			"username": req.body.username,
			"password": SHA(req.body.password).toString()
		}
	}, function (err, response, body) {
		console.log(response.statusCode)
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
					res.render('index/login', typeof body == 'string' ? JSON.parse(body) : body);
					break;
				case 200:
				res.clearCookie("token");
					res.cookie("token", body.token, { "domain": domain, "expires": 0 });
					if (req.query.url) {
						res.redirect(req.query.url);
					} else {
						res.redirect("/");
					}
					break;
				default:
					res.send("There is no status code from the internal server.");
			}
		}
	});
};