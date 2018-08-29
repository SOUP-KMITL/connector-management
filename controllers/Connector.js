'use strict';

var url = require('url');

var Connector = require('./ConnectorService');
var ConnectorModel = require('../model/connector')

module.exports.getAllConnector = function getAllConnector (req, res, next) {
  ConnectorModel.getAllConnector(req.swagger.params, res, next);
};

module.exports.getConnectorByCollectionId = function getConnectorByCollectionId (req, res, next) {
  ConnectorModel.getConnectorByCollectionId(req.swagger.params, res, next);
};

module.exports.getConnectorByUsername = function getConnectorByUsername (req, res, next) {
  ConnectorModel.getConnectorByUsername(req.swagger.params, res, next);
};

module.exports.createConnector = function createConnector (req, res, next) {
  Connector.createConnector(req.swagger.params, res, next);
};

module.exports.updateConnector = function updateConnector (req, res, next) {
  Connector.updateConnector(req.swagger.params, res, next);
};

module.exports.deleteConnector = function deleteConnector (req, res, next) {
  Connector.deleteConnector(req.swagger.params, res, next);
};
