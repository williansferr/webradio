const express    = require('express');
const router   = express.Router();
const formidable = require('formidable'),
    	    http = require('http'),
    		util = require('util');
const fs = require('fs');
// const multer = require('multer');
// const upload = multer();
const service_podcast 	 = require('../service/service-podcast');
const service_comentario = require('../service/service-comentario');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'dashboard'});

global.expand = {
	main: {
		expanded: "aria-expanded=false",
		class: "collapsed"
	},
	sub: {
		expanded: "aria-expanded=false",
		class: "collapse"
	}
}

global.classMenu = {
	menu: "aria-expanded=true",
	submenu: {
		expanded: "aria-expanded=true",
		class: "collapse in"
	},
	dashboard: {
		expand: global.expand,
		main: "active visible"
	},
	podcast: { 
		expand: global.expand,
		cadastro: "",
		consulta: ""
	},
	comentario: {
		expand: global.expand,
		consulta: ""
	}
};

	function setVisiblePodcastCadastro(){
		classMenu.menu = '';
		classMenu.submenu.expanded = '';
		classMenu.submenu.class = '';
		classMenu.podcast.cadastro = '';
	}

	function setVisibleComentario(){
		
	}

	function setVisibleDashboard(){
		
	}

	function authenticationMiddleware () {  
		return function (req, res, next) {
			if (req.isAuthenticated()) {
				return next()
			}
			res.redirect('/users/login?fail=true')
		}
	}

	function cleanPodcast(){
		classMenu.menu = '';
		classMenu.submenu.expanded = '';
		classMenu.submenu.class = '';
		classMenu.podcast.cadastro = '';
	}

	router.get('/', authenticationMiddleware(), function(req, res, next) {
		// - Buscar comentarios
		// - Trazer dados para compor os graficos
		cleanPodcast();
		classMenu.dashboard.expand.main.class = '';
		classMenu.dashboard.expand.main.expanded = 'aria-expanded=true';
		classMenu.dashboard.main = 'active visible';
		console.log(classMenu);
		res.render('app/dashboard', { classMenu: classMenu, user: {name: req.user.username, password: req.user.password, email: req.user.email}, notification: ''});
	})

	router.get('/podcast', authenticationMiddleware(), function(req, res, next) {
		
		classMenu.podcast.cadastro = "active visible";
		classMenu.podcast.consulta = "";
		classMenu.comentario.consulta = "";

  		res.render('app/podcast', {classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	})

	router.get('/podcast/consulta', authenticationMiddleware(), function(req, res, next) {
		
		classMenu.podcast.cadastro = "";
		classMenu.podcast.consulta = "active visible";
		classMenu.comentario.consulta = "";

		const header_podcast = [{name: "autor"}, {name: "Título"}, {name: "Subtítulo"}, {name: "Descrição"}, {name: "Capa"}, {name: "Audio"}];
		service_podcast.findAll(
			(err, result) => {
    			if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
    		

			res.render('app/podcast-consulta', {classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email}, podcasts: result, header_podcast: header_podcast })
  		});
		

	})

	router.post('/podcast', authenticationMiddleware(), function(req, res, next) {
		// debug('autor', req.body.autor);
		// console.log(req.body.titulo);
		// console.log(req.body.subtitulo);
		// console.log(req.body.descricao);
		// console.log(req.body.audio);
		log.info("post.dashboard/podcast");
		log.info(req.body);
		const body = req.body;
		const autor = req.body.autor,
		     titulo = req.body.titulo,
		  subtitulo = req.body.subtitulo,
		  descricao = req.body.descricao,
		      audio = req.body.audio,
		       capa = req.body.capa;
		if (typeof autor === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o autor", error: "autor não informado" }));
		}
		
		if (typeof titulo === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o título", error: "tíitulo não informado" }));
		}

		if (typeof subtitulo === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o subtítulo", error: "'subtítulo não informado'" }));	
		}

		if (typeof descricao === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe a descrição", error: "descrição não informado" }));
		}

		if (typeof audio === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o nome do audio", error: "audio não informado" }));	
		}

		if (typeof capa === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o nome da capa", error: "capa não informado" }));
		}

		// service_podcast.insert(req.body.autor, req.body.titulo, req.body.subtitulo, req.body.descricao, req.body.audio, req.body.capa,
		
		service_podcast.insert(body,
			(err, result) => {
    			if(err) return res.status(204).end(JSON.stringify({ body: body, message: "não inserido", error: err }))//res.redirect('/dashboard?classMenu=' + classMenu + '&notification=Erro%20ao%20tentar%20inserir%20podcast:"' + err +'}')
    			
    // 			req.body.notification = 'qualquer coisa'	
				// // res.redirect('/dashboard?classMenu=' + classMenu + '&notification=Podcast%20cadastrado%20com%20sucesso')
				// res.redirect('/dashboard')
				console.log(result);
				return res.status(200).end(JSON.stringify({ podcast: result.ops[0], message: "inserido" }));
  		});
		// global.db.collection("podcasts").insert({ autor: req.body.autor, titulo: req.body.titulo, subtitulo: req.body.subtitulo, descricao: req.body.descricao, audio: req.body.audio, capa: req.body.capa}, function(err, result){
	 //        console.log(err, result);
	 //    })
		// res.render('app/podcast', { classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	    // res.render('app/dashboard', { user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	})

	router.delete('/podcast/:id', authenticationMiddleware(), function(req, res, next) {
		log.info("delete.dashboard/podcast/:id");
		log.info(req.params.id);
		try {
			const id = req.params.id;
			if (typeof id === "undefined") {
				// log.warn("id não informado");
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o id", error: "id não informado" }));
			} else {
				service_podcast.remove(id, (err, result) => {
					if(err) {
						// log.warn(err);
						return res.status(204).end(JSON.stringify({ _id: id , message: "não deletado", error: err }));
					}
					// log.info(result);
					return res.status(200).end(JSON.stringify({ _id: id , message: "deletado" }));
				})	
			}
		} catch (e) {
			// log.warn(e);
			return res.status(500).end(JSON.stringify({ _id: id, message: 'delete./dashboard/podcast/:id', error: e }));
		}
	})

	router.put('/podcast/:id', authenticationMiddleware(), function(req, res, next) {
		log.info("put.dashboard/podcast/:id");
		log.info(req.params.id);
		log.info(req.body);
		const id = req.params.id,
		    body = req.body;
		try {
			if (typeof id === "undefined") {
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o id", error: "id não informado" }));
			} else if (typeof body === "undefined") {
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o objeto podcast", error: "Objeto(podcast) não informado" }));
			} else {
				service_podcast.update(req.params.id, req.body, (err, result) => {
					if(err) return res.status(204).end(JSON.stringify({ _id: id , message: "não atualizado", error: err }))

					return res.status(200).end(JSON.stringify({ _id: id , message: "atualizado" }));
				})	
			}		
		} catch (e){
			return res.status(500).end(JSON.stringify({ _id: id , message: "put./dashboard/podcast/:id", error: e }));
		}
	})

	router.get('/podcast/download', authenticationMiddleware(), function(req, res){
		var path = 'public/podcasts/';
		var file = req.body.filename;
		if (file) {
			res.download(path + file);
			return res.status(200).end(JSON.stringify({ file: file, path: path,  message: "arquivo baixado com sucesso" }));
		} else {
			return res.status(400).end(JSON.stringify({ file: file, path: path,  message: "informe o filename para realizar o download", error: "filename não informado" }));
		}
	})

	//Deprecated
	router.post('/podcast/directory', authenticationMiddleware(), function(req, res, next) {
		log.info('titulo:' + req.body.titulo);
		// currentDir = req.body.titulo;
		// console.log('currentDir:' + currentDir);
		var mypath = __dirname + '/../public/podcasts/' + req.body.titulo;

	    if (!fs.existsSync(mypath)){
			fs.mkdirSync(mypath);
		}
	})

	router.post('/podcast/upload-audio', authenticationMiddleware(), function(req, res, next) {

		var form = new formidable.IncomingForm();

		try {
		    form.parse(req);

		    var mypath = __dirname + '/../public/podcasts/audio/';

		    if (!fs.existsSync(mypath)){
				fs.mkdirSync(mypath);
			}

		    form.on('fileBegin', function (name, file){
		        file.path = mypath + file.name;
		    });

		    form.on('file', function (name, file){
		        res.status(200).end(JSON.stringify({ file: file.name,  message: "audio enviado com sucesso" }));
		    });

		    form.on('error', function(err) {
		    	res.status(500).end(JSON.stringify({ message: "erro no upload do audio", error: err }));
			});
	    } catch (e) {
	    	res.status(500).end(JSON.stringify({ method: "put./dashboard/podcast/upload-audio" , message: "", error: e }));
	    }
	    // res.sendFile(__dirname + '/dashboard');
	    

		// var form = new formidable.IncomingForm();

	 //    form.parse(req);
	 //    // const titulo = "teste/";
	 //    // console.log('titulo:' + req.body.titulo);
	 //    var mypath = __dirname + '/../public/podcasts/teste/';

		// if (!fs.existsSync(mypath)){
		// 	fs.mkdirSync(mypath);
		// }

	 //    form.on('fileBegin', function (name, file){
	 //        file.path = mypath + file.name;
	 //    });

	 //    form.on('file', function (name, file){
	 //        console.log('Uploaded ' + file.name);
	 //        res.status(200).end();
	 //    });

	 //    form.on('error', function(err) {
	 //    	console.log('Error', err);
	 //    	res.status(500).end();
		// });

	    // files = [],
    	// fields = [];
	    // form.on('field', function(field, value) {
	    //     fields.push([field, value]);
	    // })
	    // form.on('file', function(field, file) {
	    //     console.log(file.name);
	    //     files.push([field, file]);
	    // })
	    // form.on('end', function() {
	    //     console.log('done');
	    // });
	    // form.parse(req);


	    // res.sendFile('app/dashboard', { classMenu: classMenu, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	    // res.redirect('/dashboard');
	    

	    // form.parse(req, function(err, fields, files) {
     //  	res.writeHead(200, {'content-type': 'text/plain'});
     //  	res.write('received upload:\n\n');
     //  	res.end(util.inspect({fields: fields, files: files}));
    // });
    	
	})

	router.post('/podcast/upload-capa', authenticationMiddleware(), function(req, res, next) {

		var form = new formidable.IncomingForm();

		try {
		    form.parse(req);

		    var mypath = __dirname + '/../public/podcasts/capa/';

		    if (!fs.existsSync(mypath)){
				fs.mkdirSync(mypath);
			}

		    form.on('fileBegin', function (name, file){
		        file.path = mypath + file.name;
		    });

		    form.on('file', function (name, file){
		        res.status(200).end(JSON.stringify({ file: file.name,  message: "capa enviado com sucesso" }));
		    });

		    form.on('error', function(err) {
		    	res.status(500).end(JSON.stringify({ message: "erro no upload da capa", error: err }));
		    	// res.status(500).end();
			});
		} catch (e) {
	    	res.status(500).end(JSON.stringify({ method: "put./dashboard/podcast/upload-capa" , message: "", error: e }));
		}
	})


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('login', { message: = null });
// })

// router.get('/chat', authenticationMiddleware (), function(req, res){
//    res.render('chat', { username: req.user.username });
// })

// router.get('/login', function(req, res){
//   if(req.query.fail)
//     res.render('login', { message: 'Usuário e/ou senha incorretos!' });
//   else
//     res.render('login', { message: null });
// })

// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login?fail=true' })
// );

module.exports = router;
