"use strict"
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //Force NODE_ENV variable to 'development'

var /*mongoose = require('./config/mongoose'),*/
	express = require('./config/express');
/*
passport = require('./config/passport');
*/

//var db = mongoose();
var app = express();
module.exports = app;

console.log('Server running in the port 3000');
console.log('Secure Server running in the port 3003, use https://...');