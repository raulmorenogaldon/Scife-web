var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routerIndex = require('./routes/index'),
    routerNebula = require('./routes/opennebula'),
    routerStack = require('./routes/openstack'),
    routerUsers = require('./routes/users'),
    mongoose = require('mongoose');

var privateServer = 'http://localhost:4000';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', routerIndex);
app.use('/opennebula', routerNebula);
app.use('/openstack', routerStack);
app.use('/users', routerUsers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

mongoose.connect('mongodb://localhost/multiclouddb', function (err, res) {
    if(err){
        console.log("Error: connecting to database: " + err);
    }else{
        console.log("Connected to database");
    }
});

module.exports = app;