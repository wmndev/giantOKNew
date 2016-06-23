var app = angular.module('giantApp', ['ngRoute']);

console.log('app is ' +app);

app.config(function($routeProvider){
    
    $routeProvider
    .when('/', {
        templateUrl: 'main.html',
        controller: 'mainController'
    })
    .when('/dishes', {
        templateUrl: 'dishes.html',
        controller: 'dishesController'
    })
});


app.controller('mainController', ['$scope', '$log', function($scope, $log){
    
    
}]);


app.controller('dishesController', ['$scope', '$log', function($scope, $log){
    $scope.dishes = {
        one:{
            name: 'My first dish name'    
        },
        two:{
            name: 'My second dish name'
        } ,
        three:{
            name: 'My third dish name'
        },
        four:{
            name: 'My fourth dish name'
        }
    }  
    
}]);


app.directive('dishResult', function(){
    return {
        templateUrl: 'direct/dishResult.html',
        scope: {
            dishObject: "="
        }
    }
});
