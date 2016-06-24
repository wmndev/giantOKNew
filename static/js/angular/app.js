var app = angular.module('giantApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

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


app.controller('mainController', ['$scope', '$uibModal', '$log', function($scope, $uibModal, $log){
    $scope.items = ['item1', 'item2'];

    $scope.open = function(size){

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'content/ordernow.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function(){
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem){
            $scope.selected = selectedItem;
        }, function(){
            $log.info('Modal dismissed at: '+new Date());
        });



    }
    
    
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

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


app.directive('dishResult', function(){
    return {
        templateUrl: 'direct/dishResult.html',
        scope: {
            dishObject: "="
        }
    }
});
