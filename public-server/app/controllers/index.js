exports.render = function(req, res) {
	if (req.session.lastVisit) {}

	req.session.lastVisit = new Date();

	res.render('index');
};