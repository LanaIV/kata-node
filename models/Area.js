'use strict';

var Area = function Area(size) {
  if (!size || !size.length || !size.width) {
    return this;
  }

  this.size = size;

  return this;
};

Area.prototype.setLength = function setLength(length) {
  if (!this.size) {
    this.size = {};
  }

  this.size.length = parseInt(length);

  return this;
};

Area.prototype.getLength = function getLength() {
  if (this.size) {
    return parseInt(this.size.length);
  }
};

Area.prototype.setWidth = function setWidth(width) {
  if (!this.size) {
    this.size = {};
  }

  this.size.width = parseInt(width);

  return this;
};

Area.prototype.getWidth = function getWidth() {
  if (this.size) {
    return parseInt(this.size.width);
  }
};

module.exports = Area;
