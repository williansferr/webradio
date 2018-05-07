const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("podcasts").find({}).toArray(callback)
}

function findAll2(){
    return global.db.collection("podcasts").find({}).toArray();
}

function findById(_id, callback){
    global.db.collection("podcasts").findOne({_id: ObjectId(_id)}, callback)
}

function insert(podcast, callback){
	podcast.data_inclusao = new Date()
    global.db.collection("podcasts").insert(podcast, callback)
}

function update(_id, podcast, callback){
    global.db.collection("podcasts").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: podcast
    		// { 
    		// autor: podcast.autor, 
    		// titulo: podcast.titulo, 
    		// subtitulo: podcast.subtitulo, 
    		// descricao: podcast.descricao, 
    		// audio: podcast.audio, 
    		// capa: podcast.capa
	    	// }
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("podcasts").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll, findAll2 }