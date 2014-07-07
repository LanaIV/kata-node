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
    return ioService.emit('getConfiguration:error', {error : 'input is undefined'});
  }

  return fs.readFile(ioService.input, {encoding : 'utf8'},  function(error, content) {
    if (error) {
      return ioService.emit('getConfiguration:error', {error : 'can not open file : ' + ioService.input});
    }

    var inputArray = _.compact(content.split('\n'));

    if (_.isEmpty(inputArray)) {
      return ioService.emit('getConfiguration:error', {error : 'input is wrong, it should not be empty'});
    }

    if (_.size(inputArray) === 1) {
      return ioService.emit('getConfiguration:error', {error : 'at least one of mowers should be defined'});
    }

    if (_.size(inputArray) % 2 !== 1) {
      return ioService.emit('getConfiguration:error', {error : 'input is wrong, it should have odd number of lignes'});
    }

    var
      area          = inputArray[0],
      mowers        = [],
      mower         = {},
      configuration = {}
    ;

    if (!/^[0-9]+ [0-9]+$/.test(area)) {
      return ioService.emit('getConfiguration:error', {error : 'input is wrong, the first line is improperly formated'});
    }

    configuration.area = area.split(' ');

    inputArray = _.rest(inputArray);

    _.each(inputArray, function(line, index) {
      if (index % 2 === 0 && /^([1-9]+ ){2}[nesw]$/i.test(line)) {
        mower = {position : line.split(' ')};
      } else if (index % 2 === 1 && /^[agd]+$/i.test(line)) {
        mower.steps = line.split('');
        mowers.push(mower);
      } else {
        error = 'input is wrong, lines is improperly formated';
      }
    });

    if (error) {
      return ioService.emit('getConfiguration:error', {error : error});
    }

    configuration.mowers = mowers;

    return ioService.emit('getConfiguration:success', configuration);
  });
};

IOService.prototype.formatOutput = function formatOutput(mowerPositions) {
  var
    ioService = this,
    outputs   = ['Final position of mowers:']
  ;

  if (!mowerPositions) {
    return ioService.emit('formatOutput:error', {error : 'mowerPositions is undefined'});
  }

  _.each(mowerPositions, function(mowerPosition) {
    outputs.push(_.values(mowerPosition).join(' '));
  });

  return ioService.emit('formatOutput:success', outputs.join('\n'));
};

IOService.prototype.formatJsonOutput = function formatJsonOutput(mowerPositions) {
  var
    ioService  = this,
    jsonOutput = {mowers : []}
  ;

  if (!mowerPositions) {
    return ioService.emit('formatJsonOutput:error', {error : 'mowerPositions is undefined'});
  }

  _.each(mowerPositions, function(mowerPosition) {
    jsonOutput.mowers.push(mowerPosition);
  });

  return ioService.emit('formatJsonOutput:success', jsonOutput);
};

module.exports = IOService;
