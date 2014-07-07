'use strict';

var
  namespace    = 'controllers:defaultController',
  async        = require('async'),
  IOService    = require('IOService'),
  MowerService = require('MowerService'),
  logger       = require('log4js').getLogger(namespace)
;

var DefaultController = function DefaultController() {
  return this;
};

DefaultController.prototype.getHandler = function getHandler(req, res) {
  var
    input     = req.query.input || 'input',
    ioService = new IOService(input)
  ;

  return async.waterfall([
    function getConfiguration(getConfigurationCallback) {
      ioService.once('getConfiguration:error', function ioServiceErrorCallback(ioServiceError) {
        return getConfigurationCallback(ioServiceError);
      });

      ioService.once('getConfiguration:success', function ioServiceSuccessCallback(configuration) {
        return getConfigurationCallback(null, configuration.area, configuration.mowers);
      });

      return ioService.getConfigurationFromInput();
    },
    function moveMowers(area, mowers, moveMowersCallback) {
      var mowerService = new MowerService(area, mowers);

      mowerService.once('moveMowers:error', function mowerServiceErrorCallback(mowerServiceError) {
        return moveMowersCallback(mowerServiceError);
      });

      mowerService.once('moveMowers:success', function mowerServiceSuccessCallback(mowerPositions) {
        return moveMowersCallback(null, mowerPositions);
      });

      return mowerService.moveMowers();
    },
    function formatJsonOutput(mowerPositions, formatJsonOutputCallback) {
      logger.error(mowerPositions);
      ioService.once('formatJsonOutput:error', function ioServiceErrorCallback(error) {
        return formatJsonOutputCallback(error);
      });

      ioService.once('formatJsonOutput:success', function ioServiceErrorCallback(output) {
        return formatJsonOutputCallback(null, output);
      });

      return ioService.formatJsonOutput(mowerPositions);
    }
  ],
  function waterfallCallback(error, output) {
    if (error) {
      logger.error(error.error);

      return res.send(400, error);
    }

    return res.json(output);
  });
};

module.exports = new DefaultController();
