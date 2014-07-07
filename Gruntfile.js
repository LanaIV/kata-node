'use strict';

var loadGruntConfig = require('load-grunt-config');

module.exports = function(grunt) {
  var config = loadGruntConfig(grunt, {
    configPath : __dirname + '/tasks/options',
    init : true,
    loadGruntTasks : {
      scope : 'devDependencies'
    }
  });

  grunt.registerTask('default', 'Run application', ['exec:run']);

  grunt.registerTask('test', 'Run test suite', ['mochaTest:full']);
};
