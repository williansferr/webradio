const express  = require('express');
const router 	 = express.Router();
const passport = require('passport');
const db 		   = require('../db')

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login?fail=true')
  }
}

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('login', { message: null });
// })

router.get('/login', function(req, res, next){
  if(req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/users/login?fail=true' })
);

router.get('/signup', authenticationMiddleware(), function(req, res, next) {
  	if(req.query.fail)
  		res.render('signup', { message: 'Falha no cadastro do usuário!' });
	else
  		res.render('signup', { message: null });
})

router.post('/signup', authenticationMiddleware(), function(req, res, next){
  db.createUser(req.body.username, req.body.password, req.body.email, (err, result) => {
    if(err) res.redirect('/signup?fail=true')
    require('../mail')(req.body.email, 'Bem vindo!', 'Olá ' + req.body.username + ', obrigado por se cadastrar!')
    res.redirect('/users/login')
  })
})

router.get('/forgot', function(req, res, next) {
  res.render('forgot', { });
})

router.post('/forgot', function(req, res, next) {
  db.findUser(req.body.email, (err, doc) => {
    if(err || !doc) res.redirect('/users')//manda pro login mesmo que não ache
    const newpass = require('../utils').generatePassword()
    db.changePassword(req.body.email, newpass)
    require('../mail')(req.body.email, 'Sua nova senha do chat', 'Olá ' + doc.username + ', sua nova senha é ' + newpass)
    res.redirect('/users')
  })
})

router.get('/lock', function(req, res, next) {
  res.render('lock', { });
})

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/users/login')
})


module.exports = router;
