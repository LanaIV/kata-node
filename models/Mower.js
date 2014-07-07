'use strict';

var Mower = function Mower(position) {
  if (!position || !position.abscissa || !position.ordinate || !position.orientation) {
    return this;
  }

  this.position = position;

  return this;
};

Mower.prototype.getPosition = function getPosition() {
  return this.position;
};

Mower.prototype.setAbscissa = function setAbscissa(abscissa) {
  if (!this.position) {
    this.position = {};
  }

  this.position.abscissa = parseInt(abscissa);

  return this;
};

Mower.prototype.getAbscissa = function getAbscissa() {
  if (this.position) {
    return parseInt(this.position.abscissa);
  }
};

Mower.prototype.setOrdinate = function setOrdinate(ordinate) {
  if (!this.position) {
    this.position = {};
  }

  this.position.ordinate = parseInt(ordinate);

  return this;
};

Mower.prototype.getOrdinate = function getOrdinate() {
  if (this.position) {
    return parseInt(this.position.ordinate);
  }
};

Mower.prototype.setOrientation = function setOrientation(orientation) {
  if (!this.position) {
    this.position = {};
  }

  this.position.orientation = orientation;

  return this;
};

Mower.prototype.getOrientation = function getOrientation() {
  if (this.position) {
    return this.position.orientation;
  }
};

module.exports = Mower;
