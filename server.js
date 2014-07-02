'use strict';

var path = require('path');

process.env.NODE_PATH = [
  path.join(__dirname),
  path.join(__dirname, 'models'),
  path.join(__dirname, 'services'),
].join(':');

require('module')._initPaths();

var
  namespace    = 'server',
  input        = 'input',
  Area         = require('Area'),
  async        = require('async'),
  Mower        = require('Mower'),
  IOService    = require('IOService'),
  _            = require('underscore'),
  MowerService = require('MowerService'),
  logger       = require('log4js').getLogger(namespace)
;

var start = function start() {
  var ioService = new IOService(input);

  return async.waterfall([
    function getConfiguration(getConfigurationCallback) {
      ioService.once('error', function ioServiceErrorCallback(ioServiceError) {
        return getConfigurationCallback(ioServiceError);
      });

      ioService.once('success', function ioServiceSuccessCallback(configuration) {
        if (_.size(configuration) !== 5) {
          return getConfigurationCallback({message : 'configuration is wrong, it should have 5 objects'});
        }

        var area = new Area(configuration.area[0], configuration.area[1]);

        return getConfigurationCallback(null, area, configuration);
      });

      return ioService.getConfigurationFromInput();
    },
    function moveMowers(area, configuration, moveMowersCallback) {
      return async.series([
        function  moveFirstMower(moveFirstMowerCallback) {
          var
            firstMower      = new Mower(configuration.firstMower[0], configuration.firstMower[1], configuration.firstMower[2]),
            firstMowerSteps = configuration.firstMowerSteps,
            mowerService    = new MowerService(area, firstMower)
          ;

          mowerService.once('error', function mowerServiceErrorCallback(mowerServiceError) {
            return moveFirstMowerCallback(mowerServiceError);
          });

          mowerService.once('success', function mowerServiceSuccessCallback(mowerPosition) {
            return moveFirstMowerCallback(null, mowerPosition);
          });

          return mowerService.move(firstMowerSteps);
        },
        function  moveSecondMower(moveSecondMowerCallback) {
          var
            secondMower      = new Mower(configuration.secondMower[0], configuration.secondMower[1], configuration.secondMower[2]),
            secondMowerSteps = configuration.secondMowerSteps,
            mowerService    = new MowerService(area, secondMower)
          ;

          mowerService.once('error', function mowerServiceErrorCallback(mowerServiceError) {
            return moveSecondMowerCallback(mowerServiceError);
          });

          mowerService.once('success', function mowerServiceSuccessCallback(mowerPosition) {
            return moveSecondMowerCallback(null, mowerPosition);
          });

          return mowerService.move(secondMowerSteps);
        }
      ],
      function seriesCallback(error, mowerPositions) {
        if (error) {
          return moveMowersCallback(error);
        }

        return moveMowersCallback(null, mowerPositions);
      });
    },
    function formatOutput(mowers, formatOutputCallback) {
      ioService.once('error', function ioServiceErrorCallback(error) {
        return formatOutputCallback(error);
      });

      ioService.once('success', function ioServiceErrorCallback(output) {
        return formatOutputCallback(null, output);
      });

      return ioService.formatOutput(mowers);
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
