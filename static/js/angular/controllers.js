function adminOrders($scope, orderService) {

    $scope.active = true;

    function getOrders() {
        orderService.GetOrders($scope.active).then(function (activeOrders) {
            $scope.orders = activeOrders.data;
        }, function (err) {
            console.log(err);
        });
    }

    getOrders();
}

app.controller('adminDishCtrl', ['$scope', 'dishService', function ($scope, dishService) {

    dishService.GetAllDishes().then(function (dishes) {
        console.log(dishes)
        $scope.dishes = dishes.data;
    });

    $scope.submitDish = function () {
        dishService.SubmitDishes($scope.dishes);
    }
}]);

function selectedDishCtrl($scope, $routeParams, $uibModal, dishService) {
    dishService.GetSelectedDish($routeParams.id).then(function (dish) {
        $scope.dish = dish;
    });

    $scope.items = ['item1', 'item2'];
    $scope.open = function (size) {
        var template = 'content/ordernow.html'
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: template,
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                },
                isOrder: true
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function (err) {
            console.log(err);
        });
    }
}

app.controller('navCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    $scope.items = ['item1', 'item2'];
    $scope.open = function (size, isOrder) {
        var template = 'content/subscribe.html'
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

app.controller('mainController', ['$scope', '$uibModal', 'dishService', function ($scope, $uibModal, dishService) {
    dishService.GetAllDishes(true).then(function (dish) {
        $scope.dish = dish.data;
    });
}]);


app.controller('dishesController', ['$scope', 'dishService', function ($scope, dishService) {

    dishService.GetAllDishes().then(function (dishes) {
        $scope.dishes = dishes.data;
    });
}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, isOrder, orderService, subscriberService) {

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


        $scope.submitted = true;
        if (isOrder) {
            orderService.SubmitOrder(dataObj).then(function (data) {
                $scope.success = true;
            }, function (err) {
                $scope.success = false;
            });
        } else {
            subscriberService.Subscribe(dataObj).then(function (data) {
                $scope.success = true;
                console.log('subscription completed sucessfuly');
            });
        }
    };
});
