var app = angular.module('giantApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap','ngStorage']);

app.run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 20; // always scroll by 20 extra pixels
}]);

app.run(function ($rootScope, $location) {

    $rootScope.$on('$routeChangeStart', function ($rootScope, current, event, next) {
        var userAuthenticated = $rootScope.targetScope.isAuth || false;

        if (current.authenticated && !userAuthenticated) {
            $location.path('/user/LoginUser');
        }
    });
});
