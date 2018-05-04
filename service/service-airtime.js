const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("airtimes").find({}).toArray(callback)
}

function findByDataInclusao(data_inclusao, callback){
    // console.log((new Date().getDate() - 1));
    // console.log(new Date());
    global.db.collection("airtimes").find({data_inclusao: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1))}}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("airtimes").findOne({_id: _id}, callback)
}

function insert(airtime, callback){
    airtime.data_inclusao = new Date();
    global.db.collection("airtimes").insert(airtime, callback)
}

function upsert(_id, airtime, callback){
    airtime.data_inclusao = new Date();
    global.db.collection("airtimes").updateOne(
        { _id: ObjectId(_id) },
        {
            $set: airtime
        },
        {
            upsert: true,
        },
        callback)
}

function update(_id, airtime, callback){
    global.db.collection("airtimes").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: airtime
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("airtimes").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findByDataInclusao, findAll }