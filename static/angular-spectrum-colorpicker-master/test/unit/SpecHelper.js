/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false, unused: false  */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile;

beforeEach(function() {
  /* Initiate the main module */
  module('angularSpectrumColorpicker');

  /* jshint camelcase: false */
  inject(function(_$rootScope_, _$compile_) {
    $rootScope   = _$rootScope_;
    $compile     = _$compile_;
  });
});

afterEach(function() {
  // clean up all generated dom elements
  $(document.body).html('');
});
