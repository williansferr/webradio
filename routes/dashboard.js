const express = require('express');
const router  = express.Router();
const request = require('request');
const formidable = require('formidable'),
    	    http = require('http'),
    		util = require('util');
const fs = require('fs');
const service_podcast 	 = require('../service/service-podcast');
const service_comentario = require('../service/service-comentario');
const service_curtida = require('../service/service-curtidas');
const service_airtime = require('../service/service-airtime');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'dashboard'});
// const parseString = require('xml2js').parseString;

global.expanded = {
	main: {
		expanded: "aria-expanded=true",
		class: ""
	},
	sub: {
		expanded: "aria-expanded=true",
		class: "collapse in"
	}
}

global.notexpanded = {
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
		expand: null,
		main: ""
	},
	podcast: { 
		expand: null,
		cadastro: "",
		consulta: ""
	},
	comentario: {
		expand: null,
		consulta: ""
	},
	user: {
		expand: notexpanded,
		sair: ""
	}
};

	global.enableExpandMenuDashboard = function (){
		classMenu.dashboard.expand = expanded;
	}

	global.disableExpandMenuDashboard = function(){
		classMenu.dashboard.expand = notexpanded;
		classMenu.dashboard.main = '';
	}

	global.enableExpandMenuComentario = function(){
		classMenu.comentario.expand = expanded;
	}

	global.disableExpandMenuComentario = function(){
		classMenu.comentario.expand = notexpanded;
		classMenu.comentario.consulta = '';
	}

	global.enableExpandMenuPodcast = function(){
		classMenu.podcast.expand = expanded;
	}

	global.disableExpandMenuPodcast = function(){
		classMenu.podcast.expand = notexpanded;
		classMenu.podcast.consulta = ''
		classMenu.podcast.cadastro = ''
	}

	global.disableExpandAll = function(){
		disableExpandMenuComentario();
		disableExpandMenuPodcast();
		disableExpandMenuDashboard();
		disableExpandMenuDashboard();
	}

	function authenticationMiddleware () {  
		return function (req, res, next) {
			if (req.isAuthenticated()) {
				return next()
			}
			res.redirect('/users/login?fail=true')
		}
	}


	router.get('/', authenticationMiddleware(), function(req, res, next) {
		// - Buscar comentarios
		// - Trazer dados para compor os graficos
		disableExpandAll();
		enableExpandMenuDashboard();
		classMenu.dashboard.main = 'active visible';
		// console.log('expanded', classMenu.podcast.expand.main.expanded);
		// var charts = require('../public/js/init/charts.js');
		// var charts2 = require('../public/js/init/initChartsPage.js');


		service_comentario.findByDataInclusao(null, 
			(err, result) => {
    			if(err) return res.status(204).end(JSON.stringify({ message: "não localizado service_comentario.findByDataInclusao", error: err }))

				

    			var comentarios = result;
    			service_curtida.findForCharts((err, result) => {
    				if(err) return res.status(204).end(JSON.stringify({ message: "não localizado service_curtida.findForCharts", error: err }))

    				var tmp_curtidas = result;
    				let curtida = {};
    				let labels = [];
    				let series = [];
    				let tamanho = 10;
    				let maxCurtidas = 0;
    				if (tmp_curtidas.length < tamanho){
    					tamanho = tmp_curtidas.length;
    				}
    				for (var i = 0, len = tamanho; i < len; i++) {
    					labels.push(tmp_curtidas[i]._id);
    					series.push(tmp_curtidas[i].count);
    					if(tmp_curtidas[i].count > maxCurtidas){
    						maxCurtidas = tmp_curtidas[i].count;
    					}
					}

					curtida.labels = labels;
					curtida.series = [];
					curtida.series.push(series);
					curtida.high = maxCurtidas;

					var hoje = new Date();
					var dia1 = new Date();
					dia1.setDate(1);

					let data_inicial = {
						dia: dia1.getDate(),
						mes: dia1.getMonth(),
						ano: dia1.getFullYear()
					}

					let data_final = {
						dia: hoje.getDate(),
						mes: hoje.getMonth(),
						ano: hoje.getFullYear()
					}


					service_airtime.findByDataInclusaoBetween(data_inicial, data_final, (err, result) => {
    					if(err) return res.status(204).end(JSON.stringify({ message: "não localizado service_airtime.findByDataInclusaoBetween", error: err }))

    					var airtimes = result;
    					var airtime = {};
    					labels = [];
    					series = [];
    					let maxList = 0;
    					for (var i = 0, len = airtimes.length; i < len; i++) {
	    					labels.push(airtimes[i]._id.day + "/" + airtimes[i]._id.month + "/" + airtimes[i]._id.year);
	    					series.push(airtimes[i].listenersMax);
	    					if(airtimes[i].listenersMax > maxList){
	    						maxList = airtimes[i].listenersMax;
	    					}
						}
						airtime.labels = labels;
						airtime.series = [];
						airtime.series.push(series);
						airtime.high = maxList;
						airtime.hoje = hoje.getDate() + "/" + (hoje.getMonth() + 1) + "/" + hoje.getFullYear();
						airtime.dia1 = dia1.getDate() + "/" + (dia1.getMonth() + 1) + "/" + dia1.getFullYear();

						res.render('app/dashboard', { airtimeCharts: airtime, curtidaCharts: curtida, comentarios_hoje: comentarios, classMenu: classMenu, user: {name: req.user.username, password: req.user.password, email: req.user.email}, notification: ''})

    				});

					// request('http://177.54.158.150:8000/admin/listmounts'
     //                                                   ,{
     //                                                      'auth': {
     //                                                        'user': 'admin',
     //                                                        'pass': '31ypq8X18LSR',
     //                                                        'sendImmediately': false
     //                                                    }}
	    //                                   ,function (error, response, body) {
		   //              // console.log('error:', error); // Print the error if one occurred and handle it
		   //              // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

		   //              if (response.statusCode == 200){
		   //                  const parseString = require('xml2js').parseString;
		   //                  console.log('body2', body);
		   //                  console.dir('parse xml to object');
		   //                  parseString(body, function (err, result) {
		   //                    var obj = result;
		   //                    console.dir(obj);
		   //                    // console.dir(obj.icestats.source[0].listener_peak[0]);
		   //                    // var airtime_service = require('../service/service-airtime');
		   //                    // var airtime = {
		   //                    //   listener_peak: obj.icestats.source[0].listener_peak[0],
		   //                    //   mount: 'airtime_128'
		   //                    // };
		   //                    // airtime_service.upsert(airtime);
		   //                    // console.dir('listener_peak',result.source.listener_peak);
		   //                });
		   //              }
		   //                // res.send(body)
		   //          });
		   			//charts2: charts2, charts: charts,
    				
    			})
  		});
	})

	router.get('/podcast/', authenticationMiddleware(), function(req, res, next) {
		
		disableExpandAll();
		enableExpandMenuPodcast();
		classMenu.podcast.cadastro = 'active visible';

  		res.render('app/podcast', {path: "../", editPodcast: "{}", podcast: {}, classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	})

	router.get('/podcast/edit/:id', authenticationMiddleware(), function(req, res, next) {
		
		disableExpandAll();
		enableExpandMenuPodcast();
		classMenu.podcast.cadastro = 'active visible';
		const id = req.params.id;		

		service_podcast.findById(id, 
			(err, result) => {
    			if(err) return res.status(204).end(JSON.stringify({ message: "service_podcast.findById(" + id + ") não localizado", error: err }))
    		
    		try {
	    		result.capa = '/podcasts/capa/' + result.capa;
	    		result.audio = '/podcasts/audio/' + result.audio;
	    		var podcast = JSON.stringify(result);
				res.render('app/podcast', {path: "../../../", editPodcast: podcast, podcast: result, classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
			} catch(e) {
				return res.status(500).end(JSON.stringify({ message: "get - '/podcast/edit/:id'", error: e }));
			}
  		});
	})

	router.get('/podcast/consulta', authenticationMiddleware(), function(req, res, next) {
		
		disableExpandAll();
		enableExpandMenuPodcast();
		classMenu.podcast.consulta = 'active visible';

		const header_podcast = [{name: "id"}, {name: "autor"}, {name: "Título"}, {name: "Subtítulo"}, {name: "Descrição"}, {name: "Capa"}, {name: "Audio"}];
		service_podcast.findAll(
			(err, result) => {
    			if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
    		

			res.render('app/podcast-consulta', {classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email}, podcasts: result, header_podcast: header_podcast })
  		});
		

	})

	router.post('/podcast', authenticationMiddleware(), function(req, res, next) {

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
				// console.log(result);
				return res.status(200).end(JSON.stringify({ podcast: result.ops[0], message: "inserido" }));
  		});
		// global.db.collection("podcasts").insert({ autor: req.body.autor, titulo: req.body.titulo, subtitulo: req.body.subtitulo, descricao: req.body.descricao, audio: req.body.audio, capa: req.body.capa}, function(err, result){
	 //        console.log(err, result);
	 //    })
		// res.render('app/podcast', { classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	    // res.render('app/dashboard', { user: {name: req.user.username, password: req.user.password, email: req.user.email} });
	})

	router.delete('/podcast/:id', authenticationMiddleware(), function(req, res, next) {
		// console.log("delete.dashboard/podcast/:id");
		// console.log(req.params.id);
		try {
			const id = req.params.id;
			if (typeof id === "undefined") {
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o id", error: "id não informado" }));
			} else {
				service_podcast.findById(id, (err, result) => {
					if(err) {
						return res.status(204).end(JSON.stringify({ _id: id , message: "id não existe", error: err }));
					}

					var podcast = result;
					try {
						service_podcast.findByCapa(podcast.capa, (err, result) => {
							if (err) {
					    		return res.status(204).end(JSON.stringify({ podcast: podcast , message: "error: service_podcast.findByCapa", error: err }));
					    	}

							if (result.length === 1) {
								fs.unlink('./public/podcasts/capa/' + podcast.capa, function(error) {
								    if (error) {
								    	return res.status(204).end(JSON.stringify({ podcast: podcast , message: "capa não deletado", error: err }));
								    }
								    service_podcast.findByAudio(podcast.audio, (err, result) => {
								    	if (err) {
								    		return res.status(204).end(JSON.stringify({ podcast: podcast , message: "error: service_podcast.findByAudio ", error: err }));
								    	}

								    	if (result.length === 1) {
										    fs.unlink('./public/podcasts/audio/' + podcast.audio, function(error) {
											    if (error) {
											    	return res.status(204).end(JSON.stringify({ podcast: podcast , message: "audio não deletado", error: err }));
											    }
											    service_podcast.remove(id, (err, result) => {
													if(err) {
														return res.status(204).end(JSON.stringify({ _id: id , message: "não deletado", error: err }));
													}
													return res.status(200).end(JSON.stringify({ _id: id , message: "deletado" }));
												})
											});	
										} else {
											service_podcast.remove(id, (err, result) => {
												if(err) {
													// log.warn(err);
													return res.status(204).end(JSON.stringify({ _id: id , message: "não deletado", error: err }));
												}
												// console.log('service_podcast.remove', result);
												return res.status(200).end(JSON.stringify({ _id: id , message: "deletado" }));
											})
										}

									});
								});
							} else {
								service_podcast.findByAudio(podcast.audio, (err, result) => {
							    	if (err) {
							    		return res.status(204).end(JSON.stringify({ podcast: podcast , message: "error: service_podcast.findByAudio ", error: err }));
							    	}

							    	if (result.length === 1) {
									    fs.unlink('./public/podcasts/audio/' + podcast.audio, function(error) {
										    if (error) {
										    	return res.status(204).end(JSON.stringify({ podcast: podcast , message: "audio não deletado", error: err }));
										    }
										    service_podcast.remove(id, (err, result) => {
												if(err) {
													return res.status(204).end(JSON.stringify({ _id: id , message: "não deletado", error: err }));
												}
												return res.status(200).end(JSON.stringify({ _id: id , message: "deletado" }));
											})
										});	
									} else {
										service_podcast.remove(id, (err, result) => {
											if(err) {
												// log.warn(err);
												return res.status(204).end(JSON.stringify({ _id: id , message: "não deletado", error: err }));
											}
											// console.log('service_podcast.remove', result);
											return res.status(200).end(JSON.stringify({ _id: id , message: "deletado" }));
										})
									}

								});
							}
						})
					} catch (e) {
						// console.log('erro : /podcast/:id', e);
						return res.status(400).end(JSON.stringify({ erro: e , message: "erro" }));
					}
				})
			}
		} catch (e) {
			// log.warn(e);
			return res.status(500).end(JSON.stringify({ _id: id, message: 'delete./dashboard/podcast/:id', error: e }));
		}
	})

	router.put('/podcast/:id', authenticationMiddleware(), function(req, res, next) {
		// log.info("put.dashboard/podcast/:id");
		console.log('id', req.params.id);
		console.log('body',req.body);
		const id = req.params.id,
		    body = req.body;
		try {
			if (typeof id === "undefined") {
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o id", error: "id não informado" }));
			} else if (typeof body === "undefined") {
				return res.status(400).end(JSON.stringify({ _id: id , message: "informe o objeto podcast", error: "Objeto(podcast) não informado" }));
			} else {
				service_podcast.update(req.params.id, req.body, (err, result) => {
					if(err) return res.status(204).end(JSON.stringify({podcast: req.body, _id: id , message: "não atualizado", error: err }))

					return res.status(200).end(JSON.stringify({ podcast: result, _id: id , message: "atualizado" }));
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
