var {db} = require('../config/config.js')
var request = require('request')

exports.getAllConnector = function(args, res, next) {
    /**
     * Get all connector
     * 
     *
     * returns Connector
     **/
    let queryModel = {
        _id: 0,
        user: 1,
        type: 1,
        method: 1,
        endpoint: 0,
        fieldData: 1,
        header: 1,
        body: 1,
        time:1,
        createdAt: 1
    }
    db.connector.find({}, queryModel).toArray(function (err, doc) {
        res.status(200)
        res.end(doc)
    })
}
  
exports.getConnectorByCollectionId = function (collectionId, Authorizaion, res, next) {
    /**
     * Get connector by collection id
     * 
     *
     * collectionId String The name that needs to be fetched. Use user1 for testing. 
     * returns Connector
     **/
    let queryModel = {
        _id: 0,
        user: 1,
        type: 1,
        method: 1,
        endpoint: 0,
        fieldData: 1,
        header: 1,
        body: 1,
        time:1,
        createdAt: 1
    }
    if (validateToken(user, Authorizaion)){
        queryModel['endpoint'] = 1
    }
    db.connector.find({collectionId: collectionId}, queryModel).toArray(function (err, doc) {
        res.status(200)
        res.end(doc)
    })
}

exports.getConnectorByUsername = function (user, Authorizaion, next) {
    /**
     * Get connector by username
     * 
     *
     * username String The name that needs to be fetched. Use user1 for testing. 
     * returns Connector
     **/
    let queryModel = {
        _id: 0,
        user: 1,
        type: 1,
        method: 1,
        endpoint: 0,
        fieldData: 1,
        header: 1,
        body: 1,
        time:1,
        createdAt: 1
    }
    if (validateToken(user, Authorizaion)){
        queryModel['endpoint'] = 1
    }
    db.connector.find({user: user}, queryModel).toArray(function (err, doc) {
        res.status(200)
        res.end(doc)
    })
}

// exports.updateConnector = function (user, Authorizaion, next) {
    /**
     * Update connector by collection ID
     * 
     *
     * username String The name that needs to be fetched. Use user1 for testing. 
     * returns Connector
     **/

    // if (Authorizaion != undefined){
    //     if (validateToken(user, Authorizaion)) {
    //         db.products.update(
    //             { user: user },
    //             { $set: { "details.make": "zzz" } },
    //             function (err, doc){
    //                 res.status(204)
    //                 res.end("Connector updated successfully")
    //             }
    //         )
    //     }
    //     else {
    //         res.status(401)
    //         res.end("Unauthorization: Updating is denied due to invalid authorization")
    //     }
    // }
    // else {
    //     res.status(400)
    //     res.end("Missing request header 'authorization' for method parameter of type String")
    // }
// }

// exports.deleteConnector = function (user, Authorizaion, next) {
//     /**
//      * Delete connector by collection ID
//      * 
//      *
//      * username String The name that needs to be fetched. Use user1 for testing. 
//      * returns Connector
//      **/        
//     if (Authorizaion != undefined){
//         if (validateToken(user, Authorizaion)) {
//             db.connector.remove({ collectionId: collectionId }, function (err, doc) {
//                 res.status(204)
//                 res.end("Connector deleted successfully")
//             })
//         }
//         else {
//             res.status(401)
//             res.end("Unauthorization: Updating is denied due to invalid authorization")
//         }
//     }
//     else {
//         res.status(400)
//         res.end("Missing request header 'authorization' for method parameter of type String")
//     }
// }

// exports.getAllConnector = function (args, res, next) {
//     /**
//      * Get connector by username
//      * 
//      *
//      * username String The name that needs to be fetched. Use user1 for testing. 
//      * returns Connector
//      **/
    
//     var examples = {};
//     examples['application/json'] = {
//         "endpoint": "aeiou",
//         "method": "aeiou",
//         "header": "{}",
//         "time": "aeiou",
//         "body": "{}",
//         "collectionId": "aeiou",
//         "username": "aeiou"
//     };
//     if (Object.keys(examples).length > 0) {
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
//     } else {
//         res.end();
//     }
// }

// function validateToken(Authorizaion){
//     return new Promise((resolve, reject) => {
//         let options = {
//             url: 'https://api.smartcity.kmitl.io/api/v1/users?token=' + Authorizaion,
//         }
//         request(options, function (error, res, body) {
//             if(error) res.end("Error occured")
//             if(JSON.parse(body).length > 0){
//                 resolve(true)
//             }
//             else{
//                 resolve(false)
//             }
//         })
//     })
// }