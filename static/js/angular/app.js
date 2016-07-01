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
        });
});

function selectedDishCtrl($scope, $http, $routeParams) {
    $http.get('/api/dishes/' + $routeParams.id).
    success(function (data) {
        alert(data);
    });
}


app.controller('mainController', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {
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

    var weeklyDish = {
        name: 'Chraime',
        shortDescription: 'Traditional Moroccan fish dish, It contains peppers, cilantro, and tomatoes and lots of Moroccan spices',
        description: 'This dish is a tribute to Shula, mother of my sister in law and a great cook. I wish I could make all of the Moroccan dishes she make but that would require a lifetime of practice and going back in time to far places. Lucky for me Charime is easy to make as long as you have the right spices. It is spicy, it is tangy it Charimelicious!'
    };

    $scope.dish = weeklyDish;
}]);


app.controller('dishesController', ['$scope', '$log', '$http', function ($scope, $log, $http) {

    var dishesContent = [{
            name: 'Chraime',
            shortDescription: 'Traditional Moroccan fish dish, It contains peppers, cilantro, and tomatoes and lots of Moroccan spices',
            description: 'This dish is a tribute to Shula, mother of my sister in law and a great cook. I wish I could make all of the Moroccan dishes she make but that would require a lifetime of practice and going back in time to far places. Lucky for me Charime is easy to make as long as you have the right spices. It is spicy, it is tangy it Charimelicious!'
        },
        {
            name: '4 hours meatballs',
            shortDescription: 'What is the short description here?',
            description: 'This one is inspired by two recipes that came my way. Martha Stewart’s meat balls with rosemary and lemon zest and Frankie’s four hours tomato sauce. I use different mix of meat every time depends of the mood, the weather and the map of the stars. It is truly a homey and hearty and comforting food.'
        },
        {
            name: 'My thrid dish name',
            shortDescription: 'my t short description',
            description: 'itay number three'
        },
        {
            name: 'My fourth dish name',
            shortDescription: 'my fourth short description',
            description: 'itay number four'
        }]

    $scope.dishes = {
        one: {
            name: dishesContent[0].name,
            shortDescription: dishesContent[0].shortDescription,
            description: dishesContent[0].description,
            idx: '1'

        },
        two: {
            name: dishesContent[1].name,
            shortDescription: dishesContent[1].shortDescription,
            description: dishesContent[1].description,
            idx: '2'

        },
        three: {
            name: dishesContent[2].name,
            shortDescription: dishesContent[2].shortDescription,
            description: dishesContent[2].description,
            idx: '3'

        },
        four: {
            name: dishesContent[3].name,
            shortDescription: dishesContent[3].shortDescription,
            description: dishesContent[3].description,
            idx: '4'
        }
    }

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

        var res = $http.post(isOrder?'api/order': 'api/subscribe', dataObj);
        $scope.submitted = true;
        res.success(function (data, status, headers, config) {
            $scope.success = true;
            $timeout(cancel(), 10000);
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
