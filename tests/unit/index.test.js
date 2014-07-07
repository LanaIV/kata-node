'use strict';

var path = require('path');

process.env.NODE_PATH = [
  path.join(__dirname, '../../models'),
  path.join(__dirname, '../../services')
].join(':');

require('module')._initPaths();

var
  rewire       = require('rewire'),
  expect       = require('chai').expect,
  Area         = rewire('Area'),
  Mower        = rewire('Mower'),
  IOService    = rewire('IOService'),
  MowerService = rewire('MowerService')
;

var MOWER_POSITIONS = [
  {abscissa : 1, ordinate : 3, orientation : 'N'},
  {abscissa : 5, ordinate : 1, orientation : 'E'}
];

var AREA_CONFIGURATION = ['5', '5'];

var MOWER_CONFIGURATIONS = [
  {
    position : ['1', '2', 'N'],
    steps : ['G', 'A', 'G', 'A', 'G', 'A', 'G', 'A', 'A']
  },
  {
    position : ['1', '2', 'E'],
    steps : ['A', 'A', 'D', 'A', 'A', 'D', 'A', 'D', 'D', 'A']
  }
];

var AREA_SIZE = {length : '5', width : '5'};

var MOWER_POSITION = {abscissa : '1', ordinate : '2', orientation : 'N'};

describe('Unit tests suite', function() {
  describe('IOService tests', function() {
    it ('should have input defined', function() {
      var
        input = 'input',
        ioService = new IOService(input)
      ;

      expect(ioService.input).to.be.a('string');
    });

    it ('should have input undefined', function() {
      var ioService = new IOService();

      expect(ioService.input).to.be.undefined;
    });

    it ('should emit success if input is well formated', function() {
      var
        input = 'input',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:success', function(configuration) {
        expect(configuration).to.be.a('object');
        expect(configuration).to.have.property('area');
        expect(configuration).to.have.property('mowers');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if input file is not specified', function() {
      var ioService = new IOService();

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if input file does not exist', function() {
      var
        input = 'file',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if input file is empty', function() {
      var
        input = 'tests/inputs/input1',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if input file is empty', function() {
      var
        input = 'tests/inputs/input1',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if no mower is apecified in input file', function() {
      var
        input = 'tests/inputs/input2',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if only position of mower is specified', function() {
      var
        input = 'tests/inputs/input3',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if lenth or width of area is not integers', function() {
      var
        input = 'tests/inputs/input4',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if coordinates of mower is not integers', function() {
      var
        input = 'tests/inputs/input5',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if orientation is not one of cardinal directions', function() {
      var
        input = 'tests/inputs/input6',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit error if path of mower contains wrong values', function() {
      var
        input = 'tests/inputs/input7',
        ioService = new IOService(input)
      ;

      ioService.on('getConfiguration:error', function(error) {
        expect(error).to.be.an('object');
        expect(error).to.have.property('error');
      });

      ioService.getConfigurationFromInput();
    });

    it ('should emit success with string output', function() {
      var ioService = new IOService();

      ioService.on('formatOutput:success', function(output) {
        expect(output).to.be.a('string');
        expect(output).to.contain('Final position of mowers:');
      });

      ioService.formatOutput(MOWER_POSITIONS);
    });

    it ('should emit error if mowerPositions is undefined for formatOutput', function() {
      var ioService = new IOService();

      ioService.on('formatOutput:error', function(output) {
        expect(output).to.be.an('object');
        expect(output).to.have.property('error');
      });

      ioService.formatOutput(MOWER_POSITIONS);
    });

    it ('should emit success with json output', function() {
      var ioService = new IOService();

      ioService.on('formatJsonOutput:success', function(output) {
        expect(output).to.be.an('object');
        expect(output).to.have.property('mowers');
      });

      ioService.formatJsonOutput(MOWER_POSITIONS);
    });

    it ('should emit error if mowerPositions is undefined for formatJsonOutput', function() {
      var ioService = new IOService();

      ioService.on('formatJsonOutput:error', function(output) {
        expect(output).to.be.an('object');
        expect(output).to.have.property('error');
      });

      ioService.formatJsonOutput(MOWER_POSITIONS);
    });
  });

  describe('MowerService tests', function() {
    it ('should have area and mowerConfigurations defined', function() {
      var mowerService = new MowerService(AREA_CONFIGURATION, MOWER_CONFIGURATIONS);

      expect(mowerService).to.have.property('area');
      expect(mowerService).to.have.property('mowerConfigurations');
    });

    it ('should have area and mowerConfigurations undefined', function() {
      var mowerService = new MowerService();

      expect(mowerService.area).to.be.undefined;
      expect(mowerService.mowerConfigurations).to.be.undefined;
    });
  });

  describe('Area model tests', function() {
    it ('should have size defined', function() {
      var area = new Area(AREA_SIZE);

      expect(area).to.have.property('size');
      expect(area.getLength()).to.be.equal(5);
      expect(area.getWidth()).to.be.equal(5);
    });

    it ('should have size undefined', function() {
      var area = new Area();

      expect(area.size).to.be.undefined;
      expect(area.getWidth()).to.be.undefined;
      expect(area.getLength()).to.be.undefined;
    });
  });

  describe('Mower model tests', function() {
    it ('should have position defined', function() {
      var mower = new Mower(MOWER_POSITION);

      expect(mower).to.have.property('position');
      expect(mower.getAbscissa()).to.be.equal(1);
      expect(mower.getOrdinate()).to.be.equal(2);
      expect(mower.getOrientation()).to.be.equal('N');
    });

    it ('should have position undefined', function() {
      var mower = new Mower();

      expect(mower.position).to.be.undefined;
      expect(mower.getAbscissa()).to.be.undefined;
      expect(mower.getOrdinate()).to.be.undefined;
      expect(mower.getOrientation()).to.be.undefined;
    });
  });
});
