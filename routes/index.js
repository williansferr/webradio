const express          = require('express');
const router           = express.Router();
const service_podcast  = require('../service/service-podcast');
const service_curtidas = require('../service/service-curtidas');
const service_radio    = require('../service/service-radio');
const os 			   = require('os');

/* GET home page. */
router.get('/', function(req, res, next) {

	// console.log('hostname',os.hostname())
	// console.log('username:',os.userInfo().username)
	// console.log('homedir:',os.homedir())
	// console.log('networkInterfaces:',os.networkInterfaces())
	// console.log('platform:',os.platform())
	// console.log('userInfo:',os.userInfo())

		service_podcast.findAll(
			(err, result) => {
				try {

					if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
				
					// global.podcasts = result;
					// service_curtidas.findByUserAndHost(os.userInfo().username, os.hostname(),
					// 	(err, result) => {
					// 		try {
					// 			if(err) return res.render('index', { message: null, podcasts: global.podcasts, curtidas: result })
			
					// 			return res.render('index', { message: null, podcasts: global.podcasts, curtidas: result })
					// 		} catch (e) {
					//     		return res.status(500).end(JSON.stringify({ method: "get./service_podcast.findAll" , message: "", error: e}))
					//     	}
					// });

					const podcasts = result;

					service_radio.findAll((err, result) => {
						if(err) return res.status(204).end(JSON.stringify({ message: "radios não encontrados", error: err }))


						return res.render('index', { message: null, radios: result, podcasts: podcasts })

					})
				} catch (e) {
		    		return res.status(500).end(JSON.stringify({ method: "get in /" , message: "erro ao tentar buscar dados da base", error: e}));
		    	}
			});
})

router.get('/podcast/download/:audio', function(req, res){
	try {
		const audio = req.params.audio;
		const file = __dirname + '/../public/podcasts/audio/' + audio;
		res.download(file);
	} catch (e) {
    	res.status(500).end(JSON.stringify({ method: "get.podcast/download/:audio" , message: "", error: e}));
    }
});

module.exports = router;
