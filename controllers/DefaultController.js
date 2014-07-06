'use strict';

var
  namespace = 'controllers:defaultController',
  async = require('async'),
  IOService = require('IOService'),
  MowerService = require('MowerService'),
  logger = require('log4js').getLogger(namespace)
;

var DefaultController = function DefaultController() {
  return this;
};

DefaultController.prototype.getHandler = function getHandler(req, res) {
  var
    input = req.params.input || 'input',
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

      mowerService.once('moveMowers:success', function mowerServiceSuccessCallback(mowerPosition) {
        return moveMowersCallback(null, mowerPosition);
      });

      return mowerService.moveMowers();
    },
    function formatJsonOutput(mowers, formatJsonOutputCallback) {
      ioService.once('formatJsonOutput:error', function ioServiceErrorCallback(error) {
        return formatJsonOutputCallback(error);
      });

      ioService.once('formatJsonOutput:success', function ioServiceErrorCallback(output) {
        return formatJsonOutputCallback(null, output);
      });

      return ioService.formatJsonOutput(mowers);
    }
  ],
  function waterfallCallback(error, output) {
    if (error) {
      logger.error(error.message);

      return res.send(400, error);
    }

    return res.json(output);
  });
};

module.exports = new DefaultController();
