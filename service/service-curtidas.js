const ObjectId = require('mongodb').ObjectID;

function findAll(){
    global.db.collection("curtidas").find({}).toArray(callback)
}

function findById(_id, callback){
    global.db.collection("curtidas").findOne({_id: ObjectId(_id)}, callback)
}

function findByIpAndAudio(ipAddress, audio, callback){
    global.db.collection("curtidas").findOne({ip: ipAddress, audio: audio}, callback)
}

function findByUserAndHost(user, host, callback){
    global.db.collection("curtidas").find({username: user, hostname: host}).toArray(callback)
}

function findBy(user, host, audio, callback){
    global.db.collection("curtidas").findOne({username: user, hostname: host, audio: audio}, callback)
}

function findByAudio(audio, callback){
    global.db.collection("curtidas").find({audio: audio}).toArray(callback)
}

function findForCharts(callback) {
    global.db.collection("curtidas").aggregate([
                            {
                                $match: {
                                    curtiu: true
                                }
                            },
                            { 
                                $group: { 
                                    _id: "$audio",
                                    count: { 
                                        $sum: 1 
                                    } 
                                },
                            },
                            {
                                $sort: { 
                                    count: -1 
                                } 
                            }
                        ]).toArray(callback)
}

function findByDeslike(callback) {
    global.db.collection("curtidas").aggregate([
                            {
                                $match: {
                                    curtiu: false
                                }
                            },
                            { 
                                $group: { 
                                    _id: "$audio",
                                    count: { 
                                        $sum: 1 
                                    } 
                                },
                            },
                            {
                                $sort: { 
                                    count: -1 
                                } 
                            }
                        ]).toArray(callback)
}

function insert(curtida, callback){
    curtida.data_inclusao = new Date()
    global.db.collection("curtidas").insert(curtida, callback)
}

function update(_id, curtida, callback){
    global.db.collection("curtidas").updateOne(
    	{ _id: ObjectId(_id) },
    	{
    		$set: curtida
	    },
    	callback)
}

function remove(_id, callback){
    global.db.collection("curtidas").remove({ _id: ObjectId(_id) }, { justOne : true }, callback)
}

module.exports = { insert, update, remove, findById, findAll, findByUserAndHost, findForCharts, findBy, findByAudio }