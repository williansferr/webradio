const express            = require('express');
const router 	         = express.Router();
const service_ouvinte    = require('../service/service-ouvinte');
// const os 				 = require('os');
// const html2json          = require('html2json').html2json;
// const request            = require('request');
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
	
	// console.log('/curtidas/teste')
	// try {
		
	// 	console.log(os.networkInterfaces());
	// 	console.log(os.hostname());
	// 	console.log(os.userInfo());

	// 	// service_curtidas.findBy(req.body.username, req.body.hostname, req.body.audio,
	// 	// 	(err, result) => {
	// 	// 		if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }));
				
	// 	// 		console.log(result.length);
	// 	// 		if (result.length > 0) {
	// 	// 			return res.status(200).end(JSON.stringify(result[0]));	
	// 	// 		}  else {
	// 	// 			return res.status(200).end(JSON.stringify({}));
	// 	// 		}

	// 	// 	});

	// 	return res.status(200).end(JSON.stringify({
	// 		networkInterfaces: os.networkInterfaces(),
	// 		hostname: os.hostname(),
	// 		userInfo: os.userInfo()
	// 	}));
	// } catch (e) {
	// 	// log.warn(e);
	// 	return res.status(500).end(JSON.stringify({ message: 'post.curtidas/teste', error: e }));
	// }
	return res.status(200).end(JSON.stringify({message: 'olá'}));
})


router.post('/', authenticationMiddleware(), function(req, res, next) {
	try {
		let dtI = new Date(req.body.data_inicial);
		let dtF = new Date(req.body.data_final);

		let data_inicial = {
			dia: dtI.getDate(),
			mes: dtI.getMonth(),
			ano: dtI.getFullYear()
		}

		let data_final = {
			dia: dtF.getDate(),
			mes: dtF.getMonth(),
			ano: dtF.getFullYear()
		}

		service_ouvinte.findByDataInclusaoBetween(data_inicial, data_final,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "service_ouvinte.findByDataInclusaoBetween não localizado", error: err }));
			
				let ouvintes = result;

				let ouvinte = {};
				let labels = [];
				let series = [];
				let ips = [];
				for (var i = 0, len = ouvintes.length; i < len; i++) {
					if (ouvintes[i]){
						if(!labels.includes(ouvintes[i]._id.day + "/" + ouvintes[i]._id.month + "/" + ouvintes[i]._id.year)){
							labels.push(ouvintes[i]._id.day + "/" + ouvintes[i]._id.month + "/" + ouvintes[i]._id.year);
						}
						if(!ips.includes(ouvintes[i]._id.ip)){
							ips.push(ouvintes[i]._id.ip);
						}
					}
				}

				let maxList = 0, high = 0;
				let tmpseries = [];
				let descriseries = {};
				for (var i = 0; i < ips.length; i++) {
					
					for (var j = 0; j < labels.length; j++) {
						for (var k = 0; k < ouvintes.length; k++) {
							if(labels[j] === (ouvintes[k]._id.day + "/" + ouvintes[k]._id.month + "/" + ouvintes[k]._id.year)){
    							if(ips[i] === ouvintes[k]._id.ip){
									maxList = ouvintes[k].listenersMax;
									break;
    							}
							}
						}
						if(maxList > high){
							high = maxList;
						}

						// descriseries.value = maxList;
						// descriseries.name = ips[i];
						// tmpseries.push(descriseries);
						tmpseries.push(maxList);
						maxList = 0;
					}
					
					series.push(tmpseries);
					tmpseries = [];
				}
				
				ouvinte.labels = labels;
				ouvinte.series = series;
				ouvinte.ips    = ips;
				ouvinte.high   = high;
				ouvinte.hoje   = hoje.getDate() + "/" + (hoje.getMonth() + 1) + "/" + hoje.getFullYear();
				ouvinte.dia1   = dia1.getDate() + "/" + (dia1.getMonth() + 1) + "/" + dia1.getFullYear();

				return res.status(200).end(JSON.stringify({ ouvinteCharts: ouvinte, message: result }));
			});
	} catch (e) {
		return res.status(500).end(JSON.stringify({ message: 'findByDataInclusaoBetween', error: e }));
	}
})

// router.post('/', function(req, res, next) {
// 	let data = {
// 		user: req.user,
// 		request: 'ouvintes/',
// 		method: 'POST',
// 		body: req.body,
// 		date: new Date()
// 	}
// 	try {
// 		let ouvinte = {}; //req.body;
// 		// ouvinte.networkInterfaces = os.networkInterfaces();
// 		// ouvinte.hostname          = os.hostname();
// 		// ouvinte.userInfo          = os.userInfo();
// 		ouvinte.ip                = req.body.ip;

// 		data.ouvinte = ouvinte;

// 		log.info(data);
// 		service_ouvinte.insert(ouvinte,
// 			(err, result) => {

// 			if(err) {
// 				data.message = "erro ao tentar inserir um novo ouvinte"
// 				data.error = err;
// 				log.error(data);
// 				return  res.status(204).end(JSON.stringify(data));
// 			}
			
// 			data.result = result;
// 			log.info(data);

// 			data = result.ops[0];
// 			res.status(200).end(JSON.stringify(data));
			
// 		});
// 	} catch (e) {
// 		data.error = e;
// 		return res.status(500).end(JSON.stringify(data));
// 	}
// })

module.exports = router;