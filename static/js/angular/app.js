var app = angular.module('giantApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap'])
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 20;   // always scroll by 20 extra pixels
}]);







