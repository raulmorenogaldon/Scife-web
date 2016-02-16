var express = require('express');
var router= express.Router();
var aux =  require('../bin/aux')
var request = require("request");
var globals = require('../globals');

/* GET home page. */
router.get('/', function(req, res, next) {
	/*if(aux.getOrderedAccept(req.get('accept')) == 'json'){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({return: 'Ha solicitado un objeto json'}));
	}else if(aux.getOrderedAccept(req.get('accept')) == 'html'){
		res.render('index/index');
	}else{
		res.status(404).send({error: 'You need specify what type of respond you want (html or json)'});
	}*/

	request({
		uri: globals.privateServer+'/',
		method: 'GET',
		timeout: 10000
	}, function(error, response, body){
		res.send(body);
		console.log(error+"\n"+response+"\n"+body)
	}
	);

});

module.exports = router;
