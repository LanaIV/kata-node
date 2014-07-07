'use strict';

var path = require('path');

process.env.NODE_PATH = [
  path.join(__dirname),
  path.join(__dirname, 'lib'),
  path.join(__dirname, 'etc'),
  path.join(__dirname, 'models'),
  path.join(__dirname, 'services'),
  path.join(__dirname, 'controllers')
].join(':');

require('module')._initPaths();

var
  namespace    = 'server',
  input        = 'input',
  async        = require('async'),
  IOService    = require('IOService'),
  MowerService = require('MowerService'),
  argv         = require('optimist').argv,
  logger       = require('log4js').getLogger(namespace)
;

var start = function start() {
  if (!argv.o && !argv.output) {
    return require('server');
  }

  if (argv.i || argv.input) {
    input = argv.i;
  }

  var ioService = new IOService(input);

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
    function formatOutput(mowerPositions, formatOutputCallback) {
      ioService.once('formatOutput:error', function ioServiceErrorCallback(error) {
        return formatOutputCallback(error);
      });

      ioService.once('formatOutput:success', function ioServiceErrorCallback(output) {
        return formatOutputCallback(null, output);
      });

      return ioService.formatOutput(mowerPositions);
    }
  ],
  function waterfallCallback(error, output) {
    if (error) {
      return logger.error(error);
    }

    return console.log(output);
  });
};

start();
