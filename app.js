const express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon')
const logger = require('morgan');
const passport = require('passport')  
const session = require('express-session')  
const debug = require('debug')
const MongoStore = require('connect-mongo')(session)

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const comentarioRouter = require('./routes/comentario');
const curtidasRouter = require('./routes/curtidas');
const airtimeRouter = require('./routes/airtime');
const ouvinteRouter = require('./routes/ouvintes');

const app = express();

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/sweetalert2/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/datatables.net/js/'));
app.use('/css', express.static(__dirname + '/node_modules/datatables.net-dt/css/'));
app.use('/images', express.static(__dirname + '/node_modules/datatables.net-dt/images/'));

require('./auth')(passport);
app.use(session({  
  store: new MongoStore({
    db: global.db,
    ttl: 30 * 60 // = 30 minutos de sessão
  }),
  secret: 'Y7QUjEM8z122',//configure um segredo seu aqui //123 old
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/comentario', comentarioRouter);
app.use('/curtidas', curtidasRouter);
app.use('/airtime', airtimeRouter);
app.use('/ouvinte', ouvinteRouter);

//Diretorios estaticos
// app.use(express.static('public/uploads/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
