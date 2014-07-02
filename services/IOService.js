'use strict';

var
  _      = require('underscore'),
  events = require('events'),
  util   = require('util'),
  fs     = require('fs')
;

var IOService = function IOService(input) {
  events.EventEmitter.call(this);

  this.input = input;

  return this;
};

util.inherits(IOService, events.EventEmitter);

IOService.prototype.getConfigurationFromInput = function getConfigurationFromInput() {
  var ioService = this;

  if (!ioService.input) {
    return ioService.emit('error', {message : 'input is undefined'});
  }

  return fs.readFile(ioService.input, {encoding : 'utf8'},  function(error, content) {
    if (error) {
      return ioService.emit('error', error);
    }

    var inputArray = _.compact(content.split('\n'));

    if (_.size(inputArray) !== 5) {
      return ioService.emit('error', {message : 'input is wrong, it should have 5 lignes'});
    }

    var configuration = {
      area             : inputArray[0].split(' '),
      firstMower       : inputArray[1].split(' '),
      firstMowerSteps  : inputArray[2].split(''),
      secondMower      : inputArray[3].split(' '),
      secondMowerSteps : inputArray[4].split('')
    };

    return ioService.emit('success', configuration);
  });
};

IOService.prototype.formatOutput = function formatOutput(mowerPositions) {
  var ioService = this;

  if (_.size(mowerPositions) !== 2) {
    return ioService.emit('error', {message : 'At least one of mowers is undefined, both should be defined'});
  }

  var outputs = ['Final position of mowers:'];

  _.each(mowerPositions, function(mowerPosition) {
    outputs.push(_.values(mowerPosition).join(' '));
  });

  return ioService.emit('success', outputs.join('\n'));
};

module.exports = IOService;
