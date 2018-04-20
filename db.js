const bcrypt = require('bcrypt') 

function createUser(username, password, email, callback){
    const cryptPwd = bcrypt.hashSync(password, 10)
    global.db.collection("users").insert({ username, password: cryptPwd, email }, function(err, result){
        callback(err, result)
    })
}

function findUser(email, callback){
    global.db.collection("users").findOne({email}, callback)
}

function changePassword(email, password){
    const cryptPwd = bcrypt.hashSync(password, 10)
    global.db.collection("users").updateOne({email}, {$set:{password: cryptPwd}})
}

module.exports = { createUser, findUser, changePassword }