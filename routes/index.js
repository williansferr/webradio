const express = require('express');
const router = express.Router();
const service_podcast = require('../service/service-podcast');
const service_curtidas = require('../service/service-curtidas');

/* GET home page. */
router.get('/', function(req, res, next) {

	
	service_podcast.findAll(
		(err, result) => {
			if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
			
			global.podcasts = result;	
		res.render('index', { message: null, podcasts: result, indice_audio: 10 });

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
