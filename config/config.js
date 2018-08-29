const mongojs = require('mongojs')

let databaseUrl = ""
let collections = ""

if (process.env.NODE_ENV == "development"){
    databaseUrl = 'localhost:27017/connector'
    collections = ['connectors']
}
if (process.env.NODE_ENV == "production_swarm") {
    // Mapping mongo to host ip
    // In docker-compose file 
    //    extra_hosts :
    //      - "mongo:172.16.0.6"
    databaseUrl = 'mongo:27017/connector'
    collections = ['connectors']
}
if (process.env.NODE_ENV == "production_k8s") {
    databaseUrl = 'mongo-service/connector'
    collections = ['connectors']
}

module.exports.db = mongojs(databaseUrl, collections)