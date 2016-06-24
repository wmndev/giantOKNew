var app = angular.module('giantApp', ['ngRoute']);

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
    var dishesContent = [{name: 'My first dish name',
                         shortDescription: 'my f short description'},
                        {name: 'My second dish name',
                         shortDescription: 'my s short description'},
                        {name: 'My thrid dish name',
                         shortDescription: 'my t short description'},
                        {name: 'My fourth dish name',
                         shortDescription: 'my fourth short description'}]

    $scope.dishes = {
        one:{
            name: dishesContent[0].name,
            shortDescription: dishesContent[0].shortDescription
        },
        two:{
            name: dishesContent[1].name,
            shortDescription: dishesContent[1].shortDescription
        } ,
        three:{
            name: dishesContent[2].name,
            shortDescription: dishesContent[2].shortDescription
        },
        four:{
            name: dishesContent[3].name,
            shortDescription: dishesContent[3].shortDescription
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
