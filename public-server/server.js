if (!process.argv[2]) {
	console.log("ERROR: You must set the file config path");
	console.log("Usage: node server.js [File-config-path.json]");
	process.exit(-1);
} else {
	var express = require('./config/express');
	var app = express();
	module.exports = app;
}