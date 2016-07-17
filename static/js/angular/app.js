var app = angular.module('giantApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        .when('/dishes', {
            templateUrl: 'dishes.html',
            controller: 'dishesController'
        })
        .when('/dishes/:id', {
            templateUrl: 'selectedDish.html',
            controller: selectedDishCtrl
        })
        .when('/admin/dishes', {
            templateUrl: 'adminDishes.html',
            controller: 'adminDishCtrl'
        });

});

app.controller('adminDishCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.submitDish = function () {
        $http.post('api/dishes', $scope.details).then(function (data) {
            alert('ok');
        }, function (err) {
            console.log(err);
        });
    };

    var init = function () {
        $http.get('/api/dishes').
        success(function (data) {
            console.log(data);
            $scope.details = data;
        });
    }

    init();
}]);

function selectedDishCtrl($scope, $http, $routeParams) {
    $http.get('/api/dishes/' + $routeParams.id).
    success(function (data) {
        $scope.name = "My first Dish";
        $scope.shortDesc = "Yesterday I cooked my first dish";
    });
}

app.controller('navCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    $scope.items = ['item1', 'item2'];
    $scope.open = function (size, isOrder) {
        var template = isOrder ? 'content/ordernow.html' : 'content/subscribe.html'
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: template,
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                isOrder: isOrder
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    }
}]);

app.controller('mainController', ['$scope', '$uibModal', '$log', '$http', function ($scope, $uibModal, $log, $http) {
    $scope.items = ['item1', 'item2'];

    $scope.open = function (size, isOrder) {
        var template = isOrder ? 'content/ordernow.html' : 'content/subscribe.html'
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: template,
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                isOrder: isOrder
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    function init() {
        $http.get('api/dishes?isWeekly=true').then(function (dish) {
            console.log(dish);
            $scope.dish = dish.data;
        });
    }

    init();
}]);


app.controller('dishesController', ['$scope', '$log', '$http', function ($scope, $log, $http) {
    function init() {
        $http.get('/api/dishes').then(function (dishes) {
            $scope.dishes = dishes.data;
        });
    }

    init();

}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, isOrder, $http, $timeout) {

    $scope.items = items;

    $scope.success = false;
    $scope.submitted = false;

    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    var cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = cancel;

    $scope.submitOrder = function () {
        var dataObj = {
            email: $scope.email,
            dl: $scope.dl,
            comments: $scope.comments
        };

        var res = $http.post(isOrder ? 'api/order' : 'api/subscribe', dataObj);
        $scope.submitted = true;
        res.success(function (data, status, headers, config) {
            $scope.success = true;
        });
        res.error(function (data, status, headers, config) {
            alert('error');
        });

    };
});


app.directive('dishResult', function () {
    return {
        templateUrl: 'direct/dishResult.html',
        scope: {
            dishObject: "="
        }
    }
});

app.directive('dish', function () {
    return {
        templateUrl: 'direct/dish.html',
        scope: {
            details: "="
        }
    }
});
