const express            = require('express');
const router 	         = express.Router();
const service_curtidas   = require('../service/service-curtidas');
const os 				 = require('os');

router.get('/:audio', function(req, res, next) {
	
	try {
		const audio = req.params.audio;

		service_curtidas.findByAudio(audio,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "service_curtidas.findByAudio não localizado", error: err }));
			

				global.curtidas = result;
				const hostname = os.hostname()
				const username = os.userInfo().username
				service_curtidas.findBy(username, hostname, audio, (err, result) => {
					if(err) return res.status(204).end(JSON.stringify({ message: "service_curtidas.findBy não localizado", error: err }));


					console.log(result)
					var send = {curtidas: global.curtidas}
					if(result){
						send.thisuser = result.curtiu;	
					}
					console.log(send);
					return res.status(200).end(JSON.stringify(send));
				});
				
			});


	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/:audio', error: e }));
	}
	
})

//@Deprecated / teste para veriricar se o find estava retornar corretamente
router.post('/teste', function(req, res, next) {
	
	try {
		

		service_curtidas.findBy(req.body.username, req.body.hostname, req.body.audio,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }));
				
				console.log(result.length);
				if (result.length > 0) {
					return res.status(200).end(JSON.stringify(result[0]));	
				}  else {
					return res.status(200).end(JSON.stringify({}));
				}

			});
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/teste', error: e }));
	}
	
})


router.post('/', function(req, res, next) {

	// console.log('hostname',os.hostname())
	// console.log('username:',os.userInfo().username)

	const body = req.body
	     ,audio = req.body.audio
	     ,curtiu = req.body.curtiu
	     ,id_podcast = req.body.id_podcast;
	
	try {

		if (typeof body === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o objeto", error: "objeto não informado" }));
		}

		if (typeof curtiu === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe se curtiu", error: "curtiu não informado" }));
		}

		body.hostname = os.hostname()
		body.username = os.userInfo().username
		body.id_podcast = id_podcast

		service_curtidas.findBy(body.username, body.hostname, audio,
			(err, result) => {
				try {
					if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }));
					
					if (result.length > 0) {

						const obj = result[0]
						if (curtiu == result[0].curtiu) {
							return res.status(200).end(JSON.stringify({ body: result, message: "ja foi curtido pelo usuário" }))
						} else {
							service_curtidas.update(obj._id, body, 
							(err, result) => {
								try {
									if(err) return res.status(204).end(JSON.stringify({ body: body, message: "não atualizado", message: "ja foi curtido pelo usuário", error: err }))
								
									// console.log(result)
									return res.status(200).end(JSON.stringify({ body: body, message: "atualizado" }))
								} catch (e) {
									return res.status(500).end(JSON.stringify({ message: 'post.curtidas/service_curtidas.update', error: e }));
								}
							});
						}

						// return res.status(200).end(JSON.stringify({ body: result, message: "ja foi curtido pelo usuário" }))
					}  else {

						service_curtidas.insert(body,
							(err, result) => {
								try {
									if(err) return res.status(204).end(JSON.stringify({ body: body, message: "não inserido", error: err }))
								

									return res.status(200).end(JSON.stringify({ curtidas: result.ops[0], message: "inserido" }));
								} catch (e) {
									return res.status(500).end(JSON.stringify({ message: 'post.curtidas/service_curtidas.insert', error: e }));
								}
							});
					}
				} catch (e) {
					return res.status(500).end(JSON.stringify({ message: 'post.curtidas/service_curtidas.findBy', error: e }));
				}
				
			});

	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/', error: e }));
	}
})

module.exports = router;