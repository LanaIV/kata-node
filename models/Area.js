'use strict';

var Area = function Area(length, width) {
  if (!length || !width) {
    return this;
  }

  this.size = {
    length : parseInt(length),
    width  : parseInt(width)
  };

  return this;
};

Area.prototype.setLength = function setLength(length) {
  this.size.length = length;

  return this;
};

Area.prototype.getLength = function getLength() {
  return this.size.length;
};

Area.prototype.setWidth = function setWidth(width) {
  this.size.width = width;

  return this;
};

Area.prototype.getWidth = function getWidth() {
  return this.size.width;
};

module.exports = Area;
