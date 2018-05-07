const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("musicas").find({}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("musicas").findOne({_id: ObjectId(_id)}, callback)
}

function insert(musica, callback){
	musica.data_inclusao = new Date()
    global.db.collection("musicas").insert(musica, callback)
}

function update(_id, musica, callback){
    global.db.collection("musicas").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: musica
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("musicas").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll }