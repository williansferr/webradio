const express = require('express');
const path = require('path');
const favicon = require('serve-favicon')
const logger = require('morgan');
const passport = require('passport')  
const session = require('express-session')  
const debug = require('debug')
const MongoStore = require('connect-mongo')(session)
const http = require('http');
const html2json = require('html2json').html2json; //https://github.com/Jxck/html2json

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const comentarioRouter = require('./routes/comentario');
const curtidasRouter = require('./routes/curtidas');


//testando dois repositorio

const app = express();

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
  secret: '123',//configure um segredo seu aqui
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

function loopEterno(){
  setTimeout(function () {
      // console.log((new Date).toLocaleString().substr(11))
      // console.log(new Date)

      // const options = {
      //   hostname: 'http://177.54.158.150',
      //   port: 8000,
      //   path: '/airtime_128',
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     // 'Content-Length': Buffer.byteLength(postData)
      //   }
      // };

      // const req = http.request(options, (res) => {
      //   console.log(`STATUS: ${res.statusCode}`);
      //   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      //   res.setEncoding('utf8');
      //   res.on('data', (chunk) => {
      //     console.log(`BODY: ${chunk}`);
      //   });
      //   res.on('end', () => {
      //     console.log('No more data in response.');
      //   });
      // });

      // req.on('error', (e) => {
      //   console.error(`problem with request: ${e.message}`);
      // });

      // // write data to request body
      // // req.write(postData);
      // req.end();

//----------------------------------------------------------------------------------
      // http.get('http://expressjs.com/en/api.html', (res) => {

      //   const { statusCode } = res;
      //   const contentType = res.headers['content-type'];

      //   console.log('contentType', contentType);

      //   let error;
      //   if (statusCode !== 200) {
      //     error = new Error('Request Failed.\n' +
      //                       `Status Code: ${statusCode}`);
      //   // } else if (!/^application\/json/.test(contentType)) {
      //   //   error = new Error('Invalid content-type.\n' +
      //   //                     `Expected application/json but received ${contentType}`);
      //   }
      //   if (error) {
      //     console.error(error.message);
      //     // consume response data to free up memory
      //     res.resume();
      //     return;
      //   }

      //   res.setEncoding('utf8');
      //   let rawData = '';
      //   // res.on('data', (chunk) => { rawData += chunk; console.log('chunk', chunk)});
      //   res.on('data', function (chunk) {
      //     // console.log('BODY: ' + chunk);

      //     console.log(html2json(chunk.substring(chunk.indexOf('<body>'), chunk.indexOf('</body>') )));
      //   });

      //   // res.on('end', () => {
      //   //   try {
      //   //     const parsedData = JSON.parse(rawData);
      //   //     console.log(parsedData);
      //   //   } catch (e) {
      //   //     console.error(e.message);
      //   //   }
      //   // });
      // }).on('error', (e) => {
      //   console.error(`Got error: ${e.message}`);
      // });

      // loopEterno()
  }, 10000)
}

loopEterno();


module.exports = app;
