var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routesapi = require('./routes/routes');
var mongoose = require('mongoose')

var dbUrl = "mongodb://localhost:27017/test"
mongoose.connect(dbUrl);

var MongoStore = require('connect-mongo')(session);
var cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'foo',
  store: new MongoStore({
    url: dbUrl,
    autoRemove: 'native'
  })
}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routesapi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
//app.use(express.bodyParser())

//app.use(express.multipart())


app.listen(80, function () {
  
})
app.locals.moment = require('moment')
module.exports = app;
