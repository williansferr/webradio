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

/**
Teste mongodb
db.ouvintes.aggregate(
    [
        { $unwind: "$ips"},
        { 
            $group : { 
                _id : { 
                    year: { $year: "$data_inclusao" },
                    month: { $month: "$data_inclusao" },
                    day: { $dayOfMonth: "$data_inclusao" },
                    ip: "$ips.ip"

                }, 
                count : { 
                    "$sum" : 1
                },
                listenersMax: { $max: "$ips.quantidade" }
            }
        },
        {
            $sort: { 
                _id: 1
            } 
        }
    ]).pretty()
*/
function findByDataInclusaoBetween(data_inicial, data_final, callback) {

    global.db.collection("ouvintes").aggregate(
        [
            {
                $match: {
                    data_inclusao: {$gte: new Date(data_inicial.ano, data_inicial.mes, data_inicial.dia), $lt: new Date(data_final.ano, data_final.mes, data_final.dia + 1)}
                }
            },
            { $unwind: "$ips"},
            {
                $group : {
                    _id : {
                        year: { $year: "$data_inclusao" },
                        month: { $month: "$data_inclusao" },
                        day: { $dayOfMonth: "$data_inclusao" },
                        ip: "$ips.ip"

                    },
                    count : {
                        "$sum" : 1
                    },
                    listenersMax: { $max: "$ips.quantidade" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]
    ).toArray(callback);
}
/**
db.ouvintes.aggregate(
    [
        { $unwind: "$ips"},
        {
            $match: {
                "ips.ip": "200.146.89.150"
            }
        },
        { 
            $group : { 
                _id : { 
                    year: { $year: "$data_inclusao" },
                    month: { $month: "$data_inclusao" },
                    day: { $dayOfMonth: "$data_inclusao" },
                    ip: "$ips.ip"

                }, 
                count : { 
                    "$sum" : 1
                },
                listenersMax: { $max: "$ips.quantidade" }
            }
        },
        {
            $sort: { 
                _id: 1
            } 
        }
    ]).pretty()
*/
function findByIpAndDate(pip, data_inicial, data_final, callback) {

    global.db.collection("ouvintes").aggregate(
        [
            {
                $match: {
                    data_inclusao: {$gte: new Date(data_inicial.ano, data_inicial.mes, data_inicial.dia), $lt: new Date(data_final.ano, data_final.mes, data_final.dia + 1)}
                }
            },
            { $unwind: "$ips"},
            {
                $match: {
                    "ips.ip": pip
                }
            },
            {
                $group : {
                    _id : {
                        year: { $year: "$data_inclusao" },
                        month: { $month: "$data_inclusao" },
                        day: { $dayOfMonth: "$data_inclusao" },
                        ip: "$ips.ip"

                    },
                    count : {
                        "$sum" : 1
                    },
                    listenersMax: { $max: "$ips.quantidade" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]
    ).toArray(callback);
}

function upsert(ouvinte, callback){
    ouvinte.data_inclusao = new Date();
    global.db.collection("ouvintes").updateOne(
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

module.exports = { insert, update, remove, findById, findAll, findByDataInclusaoBetween }