'use strict';
const shell = require('shelljs')
const request = require('request')
var {db} = require('../config/config.js')

let responseMessage = { "status": "", "message": ""}

/* All Process run on Docker */
exports.createConnector = function(args, res, next) {
  let Authorization = args.Authorization.value
  let collectionId = args.collectionId.value
  let body = args.body.value
  if (Authorization != undefined) {
    if (validateToken(args)) {
      validateCredentials(body).then((body) => {
        validateData(body).then((body) => { // validate credentials
          deployConnector(args, body, res) // main function
        })
      })
    }
    else {
      res.status(401)
      res.end("Unauthorization: Updating is denied due to invalid authorization")
    }
  }
  else {
    res.status(400)
    res.end("Missing request header 'authorization' for method parameter of type String")
  }
}

exports.updateConnector = function (args, res, next) {
  let collectionId = args.collectionId.value
  let body = args.body.value
  if (Authorization != undefined) {
    if (validateToken(args)) {
      getDockerServiceId(collectionId).then((serviceId) => { // validate credentials
        updateConnectorEnv(args, serviceId, res) // main function
      })      
      res.end("awsdsad")
    }
    else {
      res.status(401)
      res.end("Unauthorization: Updating is denied due to invalid authorization")
    }
  }
  else {
    res.status(400)
    res.end("Missing request header 'authorization' for method parameter of type String")
  }
}

exports.deleteConnector = function(args, res, next) {
  let collectionId = args.collectionId.value
  let body = args.body.value
  if (Authorization != undefined) {
    if (validateToken(args)) {
      getDockerServiceId(collectionId).then((serviceId) => { // validate credentials
        removeConnectorEnv(args, serviceId, res) // main function
      })
      res.end("awsdsad")
    }
    else {
      res.status(401)
      res.end("Unauthorization: Removing is denied due to invalid authorization")
    }
  }
  else {
    res.status(400)
    res.end("Missing request header 'authorization' for method parameter of type String")
  }
}

// To check data which are array or object and check a 'ts' is required
function validateData(body) {
  body.isArray = false
  body.tsRequired = false
  return new Promise((resolve, reject) => {
    var options = {
      method: body.method,
      url: body.endpoint,
      headers: body.header,
      body: body.body
    }
    let data
    request(options, function (error, response, source_body) {
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', source_body); // Print the HTML for the Google homepage.
      data = JSON.parse(source_body)
      let temp = body.dataFieldRequired.split('.')
      for (var i = 0; i < temp.length; i++) {
        data = data[temp[i]]
      }
      if (Array.isArray(data) == true){
        body.isArray = true
      }
      if (data.hasOwnProperty("ts")) {
        body.tsRequired = true
      }
    })
    resolve(body)
  })
}


function validateCredentials(body){
  return new Promise((resolve, reject) => {
    if (body.headers == {}) {
      body.headers = undefined
    }
    if (Object.keys(body.body).length === 0) {
      body.body = undefined
    }
    let timeSec = '0'
    let timeMin = '0'
    let timeHour = '*'
    let time = body.time
    let substr = " "
    let cron = ''
    if(time.indexOf(substr) > -1) {
        cron = time + ' * * *'
    }
    else {
        if (Math.floor(time / 3600) > 0) { // More than an hour
            timeHour = '*/' + Math.floor(time / 3600)
        }
        else if (Math.floor(time / 60) > 0) { // More than a minute
            timeMin = '*/' + Math.floor(time / 60)
        }
        else {
            timeMin = '*'
            timeSec = '*/' + time
        }
        cron = timeSec + ' ' + timeMin + ' ' + timeHour + ' * * *'
    }
    body.cron = cron
    resolve(body)
  })
}

function validateToken(args){
  let Authorization = args.Authorization.value
  return new Promise((resolve, reject) => {
      let options = {
          url: 'https://api.smartcity.kmitl.io/api/v1/users?token=' + Authorization,
      }
      request(options, function (error, res, body) {
          if(error) res.end("Error occured")
          if(JSON.parse(body).length > 0){
              resolve(true)
          }
          else{
              resolve(false)
          }
      })
  })
}

function deployConnector(args, body, res){
  let dockerImageUrl = "registry.smartcity.kmitl.io/connector-image"
  const dockerImageName = "connector-" + args.collectionId.value
  console.log("Deploying...")
  //--secret
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "production_swarm" || process.env.NODE_ENV == "production") {
    dockerImageUrl = "worker-01:5000/connector-image"
    let dockerCreateScript = ""
    const env =
      ' -e COLLECTIONID=' + args.collectionId.value +
      ' -e AUTHORIZATION=' + args.Authorization.value +
      ' -e METHOD=' + body.method +
      ' -e ENDPOINT=' + body.endpoint +
      ' -e HEADERS=' + JSON.stringify(body.header) +
      ' -e BODY=' + JSON.stringify(body.body) +
      ' -e DATAFIELDREQUIRED=' + body.dataFieldRequired +
      ' -e ISARRAY=' + body.isArray +
      ' -e TSREQUIRED=' + body.tsRequired +
      ' -e CRON=' + '"' + body.cron + '"'
    if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "production") {
      dockerCreateScript = 'docker run -d --restart always --name=' + dockerImageName + ' ' + env + ' ' + dockerImageUrl
    }
    else if (process.env.NODE_ENV == "production_swarm") {
      const network = 'ticketing_default_test'
      dockerCreateScript = 'docker service create -d --name=' + dockerImageName + ' --network=' + network + ' ' + env + ' ' + dockerImageUrl
    }
    shell.exec(dockerCreateScript, function (code, stdout, stderr) {
      if (code == 0) {
        insertConnector(args, body)
        res.status(201)
        res.setHeader('Content-Type', 'application/json')
        responseMessage.status = "success"
        responseMessage.message = "Connector created successfully"
        res.end(JSON.stringify(responseMessage))
      }
      else {
        res.status(403)
        res.setHeader('Content-Type', 'application/json')
        responseMessage.status = "fail"
        responseMessage.message = stderr
        res.end(JSON.stringify(responseMessage))
      }
    })
  }
  else if (process.env.NODE_ENV == "production_k8s") {

  }
}

function insertConnector(args, body){
  body["user"] = args.user.value
  body["createdAt"] = new Date().getTime()
  try {
    db.connectors.insert(
      body,
      function (err, doc) {
        if (err) console.log('DB Err', err)
        db.close()
      }
    )
  }
  catch (e) {
    console.log("Inserted connector error:", e)
  }
}

function updateConnectorEnv(body ,serviceId){
  shell.exec('docker service update --env-add', function (code, stdout, stderr) {
    // console.log('Exit code:', code);
    if (code == 0) {
      // console.log('Program output:', stdout)
      try {
        db.connectors.update(
          { collectionId: collectionId },
          { $set: body },
          function (err, doc) {
            // res.status(204)
            // res.end("Connector updated successfully")
          }
        )
      }
      catch (e) {
        console.log("Updated connector error:", e)
      }
      res.status(204)
      res.write('Connector updated successfully')
    }
    else {
      // console.log('Program stderr:', stderr);
      res.status(403)
      res.write('Connector failed to update')
    }
  })
}

function removeConnector(serviceId){
  shell.exec('docker service rm ' + serviceId, function (code, stdout, stderr) {
    // console.log('Exit code:', code);
    if (code == 0) {
      // console.log('Program output:', stdout)
      try {
        db.connectors.remove(
          { collectionId: collectionId },
          function (err, doc) {
            res.status(204)
            res.end("Connector removed successfully")
          }
        )
      }
      catch (e) {
        console.log("Removed connector error:", e)
      }
      res.status(204)
      res.write('Connector removed successfully')
    }
    else {
      // console.log('Program stderr:', stderr);
      res.status(403)
      res.write('Connector failed to remove')
    }
  })
}

// function getDockerServiceId(collectionId) {
//   return new Promise((resolve, reject) => {
//     db.connectorService.find.toArray({ collectionId: collectionId }, { _id: 0, serviceId: 1 }, function (err, doc) {
//       return doc
//     })
//   })
// }