/* jshint unused: false */
/* global $, $compile, $rootScope, console */
describe('SpectrumDirective', function() {
  'use strict';


  it('should be able to find the angular module', function() {
    expect(angular.module('angularSpectrumColorpicker')).toBeDefined();
  });


  it('should initialize spectrum when compiling the directive tag', function() {
    var $pickerElement = angular.element('<spectrum-colorpicker ng-model="targetColor"></spectrum-colorpicker>');
    $compile($pickerElement)($rootScope);
    expect($pickerElement.find('input').length > 0).toBe(true);
    expect($('.sp-container').length > 0).toBe(true);
  });


  it('should update the model when changing the color in the colorpicker', function() {
    var $pickerElement = angular.element('<spectrum-colorpicker ng-model="targetColor"></spectrum-colorpicker>');
    var $scope = $rootScope.$new();
    $scope.targetColor = 'green';
    $compile($pickerElement)($scope);
    $rootScope.$digest();

    // set value within the colorpicker
    $('input.sp-input').val("#0000ff").trigger("change");

    // scope should have been changed!
    expect($scope.targetColor.toString()).toBe('#0000ff');

    // preview should have been updated!
    expect( $pickerElement.find('.sp-preview-inner').css('background-color') ).toEqual('rgb(0, 0, 255)');
  });

  it('should initialize the colorpicker with the correct default color', function() {
    var defaultColor = '#123456';
    var defaultColorRgb = 'rgb(18, 52, 86)';
    var $pickerElement = angular.element('<spectrum-colorpicker options="' + "{color: '"+ defaultColor +"'}"+'" ng-model="targetColor"></spectrum-colorpicker>');
    var $scope = $rootScope.$new();
    $scope.targetColor = 'green';
    $compile($pickerElement)($scope);
    $rootScope.$digest();

    expect($scope.targetColor).toBe(defaultColor);
    expect($pickerElement.find('.sp-preview-inner').css('background-color')).toEqual(defaultColorRgb);
  });


  it('should use via the directive given options', function() {
    var $pickerElement = angular.element('<spectrum-colorpicker ng-model="targetColor" options="{showInput: true}"></spectrum-colorpicker>');
    var $scope = $rootScope.$new();
    $scope.targetColor = 'green';
    $compile($pickerElement)($scope);
    $rootScope.$digest();

    expect($('.sp-container').hasClass('sp-input-disabled')).toBe(false);
  });

  it('should toggle the colorpicker, when the given toggler is clicked', function() {
    var $label = $('<label id="theTrigger">Click here to toggle!</label>');
    $(document.body).append($label);
    var $pickerElement = angular.element('<spectrum-colorpicker trigger-id="theTrigger" ng-model="targetColor" options="{showInput: true}"></spectrum-colorpicker>');
    var $scope = $rootScope.$new();
    $compile($pickerElement)($scope);
    $rootScope.$digest();

    $label.trigger('click');
    expect( $pickerElement.find('.sp-replacer').hasClass('sp-active') ).toBe(true);
  });

  it('should destroy the spectrum picker when destroying the directive', function() {
    var $pickerElement = angular.element('<spectrum-colorpicker ng-model="targetColor" options="{showInput: true}"></spectrum-colorpicker>');
    var $scope = $rootScope.$new();
    $compile($pickerElement)($scope);
    $rootScope.$digest();
    expect($('.sp-container').length).toBe(1);
    $pickerElement.scope().$destroy();
    expect($('.sp-container').length).toBe(0);
  });

});
