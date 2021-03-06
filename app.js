var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var interact = require('./routes/interact');
var memberaction = require('./routes/memberaction');
var back = require('./routes/back');
var sql = require('./routes/sql');
var config = require('config');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var sessionStore = new SessionStore(config.mysql_session)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({
  uploadDir:"./media/upload",
  keepExtensions:true,
  limit:10000000,
  defer:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  store:sessionStore,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);
app.use('/goods',goods);
app.use('/interact',interact);
app.use('/memberaction',memberaction);
app.use('/back',back);
app.use('/sql',sql);
app.use('/login', require('./routes/login'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found'+req.url);
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

module.exports = app;
