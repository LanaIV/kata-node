'use strict';

var Mower = function Mower(position) {
  if (!position.abscissa || !position.ordinate || !position.orientation) {
    return this;
  }

  this.position = position;

  return this;
};

Mower.prototype.getPosition = function getPosition() {
  return this.position;
};

Mower.prototype.setAbscissa = function setAbscissa(abscissa) {
  this.position.abscissa = parseInt(abscissa);

  return this;
};

Mower.prototype.getAbscissa = function getAbscissa() {
  return parseInt(this.position.abscissa);
};

Mower.prototype.setOrdinate = function setOrdinate(ordinate) {
  this.position.ordinate = parseInt(ordinate);

  return this;
};

Mower.prototype.getOrdinate = function getOrdinate() {
  return parseInt(this.position.ordinate);
};

Mower.prototype.setOrientation = function setOrientation(orientation) {
  this.position.orientation = orientation;

  return this;
};

Mower.prototype.getOrientation = function getOrientation() {
  return this.position.orientation;
};

module.exports = Mower;
