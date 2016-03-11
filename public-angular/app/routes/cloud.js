var users = require('../controllers/users'),
	cloud = require('../controllers/cloud.js');

module.exports = function (app) {
	app.get('/cloud/', function (req, res) {
		res.render('cloud/index');
	});

	app.get('/cloud/login', cloud.login);

	/**
	 * Sizes API
	 */
	app.get('/cloud/sizes', cloud.listSizes);
	app.get('/cloud/sizes/:sizeId', cloud.getSize);
	app.get('/cloud/createsize', function (req, res) {
		res.render('cloud/sizes/create');
	});
	app.post('/cloud/createsize', cloud.createSize);

	/**
		 * Instances API
		 */
	app.get('/cloud/instances', cloud.listInstances);
	app.get('/cloud/instance/:instanceId', cloud.getInstance);
	app.get('/cloud/createinstance', function (req, res) {
		res.render('cloud/instances/create');
	});
	app.post('/cloud/createinstance', cloud.createInstance);

	/**
		 * Images API
		 */
	app.get('/cloud/images', cloud.listImages);
	app.get('/cloud/images/:imageId', cloud.getInstance);

	/**
		 * Applications API
		 */
	app.get('/cloud/applications', cloud.listApplications);
	app.get('/cloud/applications/:applicationId', cloud.getApplication);
	app.get('/cloud/createapplication', function (req, res) {
		res.render('cloud/applications/create');
	});
	app.post('/cloud/createapplication', cloud.createApplication);

	/**
		 * Experiments API
		 */
	app.get('/cloud/experiments', cloud.listExperiments);
	app.get('/cloud/experiments/:experimentId', cloud.getExperiment);
	app.get('/cloud/createexperiment', function (req, res) {
		res.render('cloud/experiments/create');
	});
	app.post('/cloud/createexperiment', cloud.createExperiment);
};