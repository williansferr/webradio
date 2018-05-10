const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("radios").find({}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("radios").findOne({_id: ObjectId(_id)}, callback)
}

function insert(radio, callback){
	radio.data_inclusao = new Date()
    global.db.collection("radios").insert(radio, callback)
}

function update(_id, radio, callback){
    global.db.collection("radios").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: radio
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("radios").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll }