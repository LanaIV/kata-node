'use strict';

var Mower = function Mower(abscissa, ordinate, orientation) {
  if (!abscissa || !ordinate || !orientation) {
    return this;
  }

  this.position = {
    abscissa    : parseInt(abscissa),
    ordinate    : parseInt(ordinate),
    orientation : orientation
  };

  return this;
};

Mower.prototype.getPosition = function getPosition() {
  return this.position;
};

Mower.prototype.setAbscissa = function setAbscissa(abscissa) {
  this.position.abscissa = abscissa;

  return this;
};

Mower.prototype.getAbscissa = function getAbscissa() {
  return this.position.abscissa;
};

Mower.prototype.setOrdinate = function setOrdinate(ordinate) {
  this.position.ordinate = ordinate;

  return this;
};

Mower.prototype.getOrdinate = function getOrdinate() {
  return this.position.ordinate;
};

Mower.prototype.setOrientation = function setOrientation(orientation) {
  this.position.orientation = orientation;

  return this;
};

Mower.prototype.getOrientation = function getOrientation() {
  return this.position.orientation;
};

module.exports = Mower;
