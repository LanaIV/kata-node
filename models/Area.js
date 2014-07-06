'use strict';

var Area = function Area(size) {
  if (!size.length || !size.width) {
    return this;
  }

  this.size = size;

  return this;
};

Area.prototype.setLength = function setLength(length) {
  this.size.length = parseInt(length);

  return this;
};

Area.prototype.getLength = function getLength() {
  return parseInt(this.size.length);
};

Area.prototype.setWidth = function setWidth(width) {
  this.size.width = parseInt(width);

  return this;
};

Area.prototype.getWidth = function getWidth() {
  return parseInt(this.size.width);
};

module.exports = Area;
