/**
 * Build instructions for grunt.
 *
 * Structure seen in [rprtr](https://github.com/mrmrs/rprtr)
 * by [aputinski](https://github.com/aputinski)
 *
 * @param  {Object} grunt
 * @return {void}
 */
module.exports = function(grunt) {
  'use strict';

  var Helpers = require('./tasks/helpers');
  var config  = Helpers.config;
  var _       = grunt.util._;

  config = _.extend(config, Helpers.loadConfig('./tasks/options/'));

  /* Load grunt tasks from NPM packages */
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  /* "Helper" Tasks */
  grunt.registerTask('_protractor:start', ['http-server:test', 'protractor']);
  grunt.registerTask('_test:beforeEach', ['jshint']);

  /* "Public" Tasks */

  /* Alias for starting the demo server */
  grunt.registerTask('demo', ['http-server:demo']);
  
  /* Watch source and test files and execute karma unit tests on change. */
  grunt.registerTask('watch:start', ['karma:watch:start', 'watch:andtest']);

  /* Execute all tests. */
  grunt.registerTask('test', ['_test:beforeEach', 'karma:all', '_protractor:start']);
  /* Execute e2e tests. */
  grunt.registerTask('test:e2e', ['_test:beforeEach', '_protractor:start']);
  /* Execute unit tests. */
  grunt.registerTask('test:unit', ['_test:beforeEach', 'karma:all']);
  /* Execute karma tests with Firefox and PhantomJS. */
  grunt.registerTask('test:travis', ['_test:beforeEach', 'karma:travis']);

  /* Build dist files. */
  grunt.registerTask('build', ['concat:dist', 'uglify']);

  /* Distribute a new version. */
  grunt.registerTask('dist', function() {
    grunt.log.errorlns('deprecated, please use `grunt release`');
  });
  grunt.registerTask('release', 'Test, bump, build and release.', function(type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'bump-commit'
    ]);
  });

  /* test and build by default. */
  grunt.registerTask('default', ['test', 'build']);

  grunt.initConfig(config);
};
