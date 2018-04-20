const ObjectId = require('mongodb').ObjectID;

function findAll(){
    return global.db.collection("curtidas").find({}).toArray()
}

function findById(_id, callback){
    global.db.collection("curtidas").findOne({_id: _id}, callback)
}

function findByAudio(audio, callback){
    return global.db.collection("curtidas").findOne({audio: audio})
}

function insert(curitda, callback){
    curitda.data_inclusao = new Date()
    global.db.collection("curtidas").insert(curitda, callback)
}

function update(_id, curitda, callback){
    global.db.collection("curtidas").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: curitda
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("curtidas").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll }