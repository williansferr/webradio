const express            = require('express');
const router 	         = express.Router();
const service_curtidas = require('../service/service-curtidas');

router.get('/:audio', function(req, res, next) {
	try {
		const audio = req.params.audio;

		service_podcast.findByAudio(audio,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
			

			return res.status(200).end(JSON.stringify(result));
	
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/:audio', error: e }));
	}
})


router.post('/', function(req, res, next) {
	
	const body = req.body
	     ,audio = req.body.audio
	     ,curtiu = req.body.curtiu;
	try {
		if (typeof body === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o objeto", error: "objeto não informado" }));
		}

		if (typeof curtiu === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe se curtiu", error: "curtiu não informado" }));
		}
		
		service_curtidas.insert(body,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ body: body, message: "não inserido", error: err }))
				
				console.log(result);
				return res.status(200).end(JSON.stringify({ curtidas: result.ops[0], message: "inserido" }));
			});
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ message: 'post.curtidas/', error: e }));
	}
})

module.exports = router;