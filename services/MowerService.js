'use strict';

var
  util         = require('util'),
  Area         = require('Area'),
  async        = require('async'),
  Mower        = require('Mower'),
  events       = require('events'),
  orientations = ['N', 'E', 'S', 'W'],
  _            = require('underscore')
;

var MowerService = function MowerService(areaConfiguration, mowerConfigurations) {
  events.EventEmitter.call(this);

  var areaSize = _.object(['length', 'width'], areaConfiguration);

  this.area = new Area(areaSize);
  this.mowerConfigurations = mowerConfigurations;
  this.takenCells = [];

  return this;
};

util.inherits(MowerService, events.EventEmitter);

MowerService.prototype.isFreeCell = function isFreeCell(coodinates) {
  if (_.findWhere(this.takenCells, coodinates)) {
    return false;
  }

  return true;
};

MowerService.prototype.moveNorth = function moveNorth(mower) {
  var
    mowerOrdinate = mower.getOrdinate(),
    mowerNextCoordinates = {
      abscissa : mower.getAbscissa(),
      ordinate : mowerOrdinate + 1
    }
  ;

  if (mowerOrdinate < this.area.getWidth() && this.isFreeCell(mowerNextCoordinates)) {
    mower.setOrdinate(mowerOrdinate + 1);
  }

  return mower;
};

MowerService.prototype.moveEast = function moveEast(mower) {
  var
    mowerAbscissa = mower.getAbscissa(),
    mowerNextCoordinates = {
      abscissa : mowerAbscissa + 1,
      ordinate : mower.getOrdinate()
    }
  ;

  if (mowerAbscissa < this.area.getLength() && this.isFreeCell(mowerNextCoordinates)) {
    mower.setAbscissa(mowerAbscissa + 1);
  }

  return mower;
};

MowerService.prototype.moveSouth = function moveSouth(mower) {
  var
    mowerOrdinate = mower.getOrdinate(),
    mowerNextCoordinates = {
      abscissa : mower.getAbscissa(),
      ordinate : mowerOrdinate - 1
    }
  ;

  if (mowerOrdinate > 0 && this.isFreeCell(mowerNextCoordinates)) {
    mower.setOrdinate(mowerOrdinate - 1);
  }

  return mower;
};

MowerService.prototype.moveWest = function moveWest(mower) {
  var
    mowerAbscissa = mower.getAbscissa(),
    mowerNextCoordinates = {
      abscissa : mowerAbscissa - 1,
      ordinate : mower.getOrdinate()
    }
  ;

  if (mowerAbscissa > 0 && this.isFreeCell(mowerNextCoordinates)) {
    mower.setAbscissa(mowerAbscissa - 1);
  }

  return mower;
};

MowerService.prototype.moveMower = function moveMower(mower, steps) {
  var
    mowerService = this,
    errorMessage = 'can not move mower, @params is not defined'
  ;

  if (!mowerService.area) {
    return mowerService.emit('moveMower:error', {message : errorMessage.replace('@params', 'area')});
  }

  if (!mower) {
    return mowerService.emit('moveMower:error', {message : errorMessage.replace('@params', 'mower')});
  }

  if (!steps) {
    return mowerService.emit('moveMower:error', {message : errorMessage.replace('@params', 'steps')});
  }

  var
    orientationIndex = orientations.indexOf(mower.getOrientation()),
    mowerInitialCoordinates = {
      abscissa : mower.getAbscissa(),
      ordinate : mower.getOrdinate()
    }
  ;

  mowerService.takenCells = _.reject(mowerService.takenCells, _.matches(mowerInitialCoordinates));

  _.each(steps, function(step) {
    switch (step) {
      case 'A' :
        switch (mower.getOrientation()) {
          case 'N' :
            mower = mowerService.moveNorth(mower);
            break;
          case 'E' :
            mower = mowerService.moveEast(mower);
            break;
          case 'S' :
            mower = mowerService.moveSouth(mower);
            break;
          case 'W' :
            mower = mowerService.moveWest(mower);
            break;
          default :
            break;
        }
        break;
      case 'D' :
        orientationIndex = (orientations.length + (++orientationIndex)) % orientations.length;
        mower.setOrientation(orientations[orientationIndex]);
        break;
      case 'G' :
        orientationIndex = (orientations.length + (--orientationIndex)) % orientations.length;
        mower.setOrientation(orientations[orientationIndex]);
        break;
      default :
        break;
    }
  });

  mowerService.takenCells.push(_.omit(mower.getPosition(), 'orientation'));

  return mowerService.emit('moveMower:success', mower.getPosition());
};

MowerService.prototype.moveMowers = function moveMowers() {
  var
    error = {},
    seriesTasks = [],
    mowerService = this
  ;

  var move = function move(position, steps) {
    return function(callback) {
      var mower = new Mower(position);

      if (mower.getAbscissa() > mowerService.area.getLength() || mower.getOrdinate() > mowerService.area.getWidth()) {
        return callback({message : 'can not move mower, it is out of area'});
      }

      mowerService.once('moveMower:error', function mowerServiceErrorCallback(mowerServiceError) {
        return callback(mowerServiceError);
      });

      mowerService.once('moveMower:success', function mowerServiceSuccessCallback(mowerPosition) {
        return callback(null, mowerPosition);
      });

      return mowerService.moveMower(mower, steps);
    };
  };

  _.each(mowerService.mowerConfigurations, function(mowerConfiguration) {
    var
      mowerPosition = _.object(['abscissa', 'ordinate', 'orientation'], mowerConfiguration.position),
      takenCell     = {
        abscissa : parseInt(mowerPosition.abscissa),
        ordinate : parseInt(mowerPosition.ordinate)
      }
    ;

    // if (_.findWhere(mowerService.takenCells, takenCell)) {
    //   error.message = 'can not place mower, the cell is already taken';
    //   return error;
    // }

    mowerService.takenCells.push(takenCell);

    seriesTasks.push(move(mowerPosition, mowerConfiguration.steps));
  });

  // if (error.message) {
  //   return mowerService.emit('moveMowers:error');
  // }

  return async.series(seriesTasks, function seriesCallback(error, mowerPositions) {
    if (error) {
      return mowerService.emit('moveMowers:error', error);
    }

    return mowerService.emit('moveMowers:success', mowerPositions);
  });
};

module.exports = MowerService;
