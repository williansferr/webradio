const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("ouvintes").find({}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("ouvintes").findOne({_id: ObjectId(_id)}, callback)
}

function insert(ouvinte, callback){
	ouvinte.data_inclusao = new Date();
    global.db.collection("ouvintes").insert(ouvinte, callback);
}

function upsert(ouvinte, callback){
    ouvinte.data_inclusao = new Date();
    global.db.collection("airtimes").updateOne(
    { 
        _id: ObjectId(ouvinte._id)
    },
    {
        $set: ouvinte
    },
    {
        upsert: true,
    },
    callback);
}

function update(_id, ouvinte, callback){
    global.db.collection("ouvintes").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: ouvinte
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("ouvintes").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll }