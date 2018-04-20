const express            = require('express');
const router 	         = express.Router();
const service_comentario = require('../service/service-comentario');

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login?fail=true')
  }
}

router.get('/', authenticationMiddleware (), function(req, res, next) {
	classMenu.podcast.cadastro = "";
	classMenu.podcast.consulta = "";
	classMenu.comentario.consulta = "active visible";

	const header_comentario = [{name: "Nome"}, {name: "E-mail"}, {name: "Comentario"}];
	service_comentario.findAll(
		(err, result) => {
			if(err) return res.status(204).end(JSON.stringify({ message: "não localizado", error: err }))
		
			res.render('app/comentario', {classMenu: classMenu, message: null, user: {name: req.user.username, password: req.user.password, email: req.user.email}, comentarios: result, header_comentario: header_comentario })
		});
})

router.post('/', function(req, res, next) {
	
	const body = req.body
	     ,nome = req.body.nome
	     ,email = req.body.email
	     ,comentario = req.body.comentario;
	try {
		if (typeof body === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o objeto comentario", error: "objeto comentario não informado" }));
		}

		if (typeof nome === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o nome", error: "nome não informado" }));
		}

		if (typeof email === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o email", error: "email não informado" }));
		}

		if (typeof comentario === "undefined") {
			return res.status(400).end(JSON.stringify({ message: "informe o comentario", error: "comentario não informado" }));
		}
		
		service_comentario.insert(body,
			(err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ body: body, message: "não inserido", error: err }))
				
				console.log(result);
				return res.status(200).end(JSON.stringify({ podcast: result.ops[0], message: "inserido" }));
			});
	} catch (e) {
		// log.warn(e);
		return res.status(500).end(JSON.stringify({ body: body, message: 'post.comentario/', error: e }));
	}
})

router.delete('/:id', authenticationMiddleware(), function(req, res, next) {
	log.info("delete.comentario/:id");
	log.info(req.params.id);
	try {
		const id = req.params.id;
		if (typeof id === "undefined") {
			// log.warn("id não informado");
			return res.status(400).end(JSON.stringify({ _id: id , message: "informe o id", error: "id não informado" }));
		} else {
			service_comentario.remove(id, (err, result) => {
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
		return res.status(500).end(JSON.stringify({ _id: id, message: 'delete.comentario/:id', error: e }));
	}
})

router.put('/:id', authenticationMiddleware(), function(req, res, next) {
	log.info("put.comentario/:id");
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
			service_comentario.update(req.params.id, req.body, (err, result) => {
				if(err) return res.status(204).end(JSON.stringify({ _id: id , message: "não atualizado", error: err }))

				return res.status(200).end(JSON.stringify({ _id: id , message: "atualizado" }));
			})	
		}		
	} catch (e){
		return res.status(500).end(JSON.stringify({ _id: id , message: "put.comentario/:id", error: e }));
	}
})

module.exports = router;