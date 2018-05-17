const express            = require('express');
const router 	         = express.Router();
const service_ouvinte    = require('../service/service-ouvinte');
const os 				 = require('os');
const html2json          = require('html2json').html2json;
const request            = require('request');
const bunyan = require('bunyan');
const log = bunyan.createLogger(
{
  name: "webradioApp",
  streams: [{
    path: '/var/log/webradioApp_ouvintes.log',
  }]
});

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login?fail=true')
  }
}

router.get('/:audio', authenticationMiddleware (), function(req, res, next) {
	
	try {
		
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/:audio', error: e }));
	}
	
})

//@Deprecated / teste para veriricar se o find estava retornar corretamente
router.post('/teste', authenticationMiddleware (), function(req, res, next) {
	
	console.log('/curtidas/teste')
	try {
		
		console.log(os.networkInterfaces());
		console.log(os.hostname());
		console.log(os.userInfo());

		// service_curtidas.findBy(req.body.username, req.body.hostname, req.body.audio,
		// 	(err, result) => {
		// 		if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }));
				
		// 		console.log(result.length);
		// 		if (result.length > 0) {
		// 			return res.status(200).end(JSON.stringify(result[0]));	
		// 		}  else {
		// 			return res.status(200).end(JSON.stringify({}));
		// 		}

		// 	});

		return res.status(200).end(JSON.stringify({
			networkInterfaces: os.networkInterfaces(),
			hostname: os.hostname(),
			userInfo: os.userInfo()
		}));
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/teste', error: e }));
	}
	
})


router.get('/teste2', authenticationMiddleware (), function(req, res, next) {
	try {

		console.log('passo1');

      	request('http://177.54.158.150:8000/admin/listclients.xsl?mount=/airtime_128'
                                                     ,{
                                                        'auth': {
                                                        'user': 'admin',
                                                        'pass': '31ypq8X18LSR',
                                                        'sendImmediately': false
                                                      }}
                                    ,function (error, response, body) {

            console.log('passo2');
          if (response) {
          	console.log('passo3');
            // console.log(response);
            if (response.statusCode == 200){
            	console.log(body);
            	// json === html2json(body.innerHTML);

            }
          }
      });

    } catch(e){
      log.error({
        error: e,
        request: 'http://177.54.158.150:8000/admin/listclients.xsl?mount=/airtime_128'
      });
    }
})

router.post('/', function(req, res, next) {
	let data = {
		user: req.user,
		request: 'ouvintes/',
		method: 'POST',
		body: req.body,
		date: new Date()
	}
	try {
		let ouvinte = {}; //req.body;
		// ouvinte.networkInterfaces = os.networkInterfaces();
		// ouvinte.hostname          = os.hostname();
		// ouvinte.userInfo          = os.userInfo();
		ouvinte.ip                = req.body.ip;

		data.ouvinte = ouvinte;

		log.info(data);
		service_ouvinte.insert(ouvinte,
			(err, result) => {

			if(err) {
				data.message = "erro ao tentar inserir um novo ouvinte"
				data.error = err;
				log.error(data);
				return  res.status(204).end(JSON.stringify(data));
			}
			
			data.result = result;
			log.info(data);

			data = result.ops[0];
			res.status(200).end(JSON.stringify(data));
			
		});
	} catch (e) {
		data.error = e;
		return res.status(500).end(JSON.stringify(data));
	}
})

module.exports = router;