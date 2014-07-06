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

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', 'Run application', ['exec:run']);
};
