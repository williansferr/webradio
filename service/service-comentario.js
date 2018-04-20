const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("comentarios").find({}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("comentarios").findOne({_id: _id}, callback)
}

function insert(comentario, callback){
    comentario.data_inclusao = new Date();
    global.db.collection("comentarios").insert(comentario, callback)
}

function update(_id, comentario, callback){
    global.db.collection("comentarios").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: comentario
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("comentarios").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll }