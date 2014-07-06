'use strict';

module.exports = function getRoutes(app) {
  app.use('/', require('defaultController').getHandler);
};
