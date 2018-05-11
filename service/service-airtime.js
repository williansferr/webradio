const ObjectId = require('mongodb').ObjectID;

function findAll(callback){
    global.db.collection("airtimes").find({}).toArray(callback)
}

function findByDataInclusao(data_inclusao, callback){
    global.db.collection("airtimes").find({data_inclusao: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1))}}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("airtimes").findOne({_id: _id}, callback)
}

//gte = greater than or equals
function findByDataInclusaoGTE(date, callback) {
    global.db.collection("airtimes").find({data_inclusao: {$gte: date}}).toArray(callback)
}

/**
Exemplo no mongodb
db.airtimes.aggregate(
[
    {
        $match: {
            data_inclusao: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1))}
        }
    },
    { 
        $group : { 
            _id : { 
                year: { $year: "$data_inclusao" },
                month: { $month: "$data_inclusao" },
                day: { $dayOfMonth: "$data_inclusao" }
            }, 
            count : { 
                "$sum" : 1 
            },
            listenersMax: { $max: "$listeners"}
        } 
    }
]).pretty()
*/
function findByDataInclusaoBetween(data_inicial, data_final, callback) {
    // console.log('date_inicial', data_inicial);
    // console.log('data_final', data_final);
    // date_inicial.setHours(0,0,0);
    // date_final.setHours(0,0,0);
    //data_inclusao: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1))}

    global.db.collection("airtimes").aggregate(
        [
            {
                $match: {
                    data_inclusao: {$gte: new Date(data_inicial.ano, data_inicial.mes, data_inicial.dia), $lt: new Date(data_final.ano, data_final.mes, data_final.dia + 1)}
                }
            },
            { 
                $group : { 
                    _id : { 
                        year: { $year: "$data_inclusao" },
                        month: { $month: "$data_inclusao" },
                        day: { $dayOfMonth: "$data_inclusao" }
                    }, 
                    count : { 
                        "$sum" : 1 
                    },
                    listenersMax: { $max: "$listeners"}
                } 
            }
        ]
    ).toArray(callback);
}

function insert(airtime, callback){
    airtime.data_inclusao = new Date();
    global.db.collection("airtimes").insert(airtime, callback)
}

/**
    Buscar airtimes onde listener_peak, listeners, mount e data de hoje existir na 
    collection (airtimes).
*/
function findByAirtimeToday(airtime, callback){
    var dia = airtime.data_inclusao.getDate();
    var mes = airtime.data_inclusao.getMonth();
    var ano = airtime.data_inclusao.getFullYear();
    global.db.collection("airtimes").aggregate(
        [
            {
                $match:
                {
                    listener_peak: airtime.listener_peak,
                    listeners: airtime.listeners,
                    mount: airtime.mount
                }
            },
            {
                $project:
                {
                    year: { $year: "$data_inclusao" },
                    month: { $month: "$data_inclusao" },
                    day: { $dayOfMonth: "$data_inclusao" }
                }
            },
            {
                $match:
                {
                    year: { $gte: ano },
                    month: { $gte: (mes + 1) },
                    day: { $gte: dia }
                }
            },
            {
                $sort: { 
                    day: -1,
                    month: -1,
                    year: -1
                } 
            }
        ]
    ).toArray(callback);
}

/**
    Insere ou atualiza caso listener_peak, listeners, mount e data atual não existir
    na colleciton airtimes
*/
function upsert(airtime, callback){
    airtime.data_inclusao = new Date();
    findByAirtimeToday(airtime,  (err, result) => {
        if(err){
        } else if ( result.length === 0 ) {
            global.db.collection("airtimes").updateOne(
            { 
                // data_inclusao: {$lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1))},
                listener_peak: airtime.listener_peak,
                listeners: airtime.listeners,
                mount: airtime.mount
            },
            {
                $set: airtime
            },
            {
                upsert: true,
            },
            callback);
        }
    })
    
}

/**
    Exemplo atualizando apenas o campo autor
    db.radios.update({
        _id: ObjectId("5af48c8fa8ce524aeaa2ade1")
    },
    {
        $set : {
            "autor" : "teste"
        }
    })
*/
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

module.exports = { insert, upsert,  update, remove, findById, findByDataInclusao, findByDataInclusaoGTE, findByDataInclusaoBetween, findAll }