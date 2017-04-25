require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var passport = require('passport');//before db require
require('./app_api/models/db');
require('./app_api/config/passport');// after db require, before route definition
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());
var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');

var users = require('./app_server/routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'jade');
/*
var appClientFiles = ['app_client/common/service/geoLocation.service.js',
                      'app_client/common/service/loc8rData.service.js',
                      'app_client/home/home.controller.js',
                      'app_client/app.js'];
var uglified = uglifyJs.minify(appClientFiles, {compress: false});
fs.writeFile('public/loc8r.min.js', uglified.code, function (err) {
    if (err){
      console.log(err);
    }else {
      console.log('Script generated and saved as loc8r.min.js');
    }
});*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', routes);
app.use('/api',routesApi);//api operation
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// catch unauthorized errors (401)
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({'message': err.name + ':' + err.message});
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
