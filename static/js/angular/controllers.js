function loginController($scope, $location, authenticationService){

    $scope.authenticate = function(){
        var isAuth = authenticationService.AuthenticateUsingCredentials($scope.username, $scope.password);
        if (isAuth){
            $location.path('/admin/console');
        }
    }


}

function adminOrders($scope, orderService) {
    $scope.isActive = true;

    var getOrders = function (isActive) {
        $scope.isActive = isActive;
        orderService.GetOrders(isActive).then(function (activeOrders) {
            $scope.orders = activeOrders.data;
        }, function (err) {
            console.log(err);
        });
    }

    getOrders(true);


    $scope.deactivateOrders = function () {
        orderService.DeactivateOrders().then(function (data) {
            getOrders(false);
        });
    }

    $scope.getOrders = getOrders;
}

function adminNotifications($scope, orderService, subscriberService, emailService) {

    var messages = {
        orderPrepared: {
            content: '<h3><b>Dear customer,</b></h3>' +
                '<p>Just letting you know that your order is being prepared</p><br>' +
                '<p>We appriciate your business, <br> Yuval and the team</p><br>' +
                '<a href="https://giantok.herokuapp.com">GiantOK</a>, Make Lunch Great Again!'
        },
        orderReady: {
            content: '<h3><b>Dear customer,</b></h3>' +
                '<p>Just letting you know that your order is ready and waiting for you in the kitchen</p><br>' +
                '<p>We appriciate your business, <br> Yuval and the team</p><br>' +
                '<a href="https://giantok.herokuapp.com">GiantOK</a>, Make Lunch Great Again!'
        },
        costumize: {
            content: 'Enter your content'
        }
    };



    $scope.getActiveEmails = function (action) {
         $scope.data = [];
        orderService.GetOrders(true).then(function (activeOrders) {
            activeOrders.data.forEach(function (item) {
                $scope.data.push(item.email);
            });

            $scope.action = action;
            if (action === 'Prepared') {
                $scope.message = messages.orderPrepared.content;
            } else {
                $scope.message = messages.orderReady.content;
            }
        }, function (err) {
            console.log(err);
        });
    }

    $scope.getAllSubscribers = function (action) {
         $scope.data = [];
        subscriberService.GetAllSubscribers().then(function (subscribers) {
            subscribers.data.forEach(function (item) {
                $scope.data.push(item.email);
            });

            $scope.action = action;
            $scope.message = messages.costumize.content;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.sendMail = function () {
        var data = {
            content: $scope.message,
            to: $scope.data,
            action: $scope.action
        }

        emailService.SendEmail(data).then();



    }

}

app.controller('orderController', ['$scope', '$http', 'dishService', 'orderService', function ($scope, $http, dishService, orderService) {
    $scope.dish = dishService.GetDish();

    $scope.submitOrder = function () {
        var dataObj = {
            email: $scope.email,
            comments: $scope.comments,
            status: 'Intial',
            payment: 1
        };
        $scope.result = {
            success: false,
            msg: ''
        };


        $scope.submitted = true;
        orderService.SubmitOrder(dataObj).then(function (data) {
            $scope.result.success = true;
            $scope.result.msg = 'Your order was submitted successfully! \n You should recieve an email confirmation to: ' +
                $scope.email + ' shortly.'
        }, function (err) {
            $scope.success = false;
        });

    };

}]);

app.controller('adminDishCtrl', ['$scope', 'dishService', function ($scope, dishService) {

    dishService.GetAllDishes().then(function (dishes) {
        $scope.dishes = dishes.data;
    });

    $scope.submitDish = function () {
        dishService.SubmitDishes($scope.dishes);
    }
}]);

function selectedDishCtrl($scope, $routeParams, $uibModal, $anchorScroll, $location, dishService, reviewService) {
    dishService.GetSelectedDish($routeParams.id)
        .then(function (dish) {
            $scope.dish = dish;
        });

    reviewService.GetAllReviews($routeParams.id)
        .then(function (reviews) {
            $scope.reviews = reviews;
        });

    $scope.gotoElementId = function (x) {
        var newHash = x;
        if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(x);
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
    };

    $scope.disableAddReview = function () {
        return $scope.review.name.length === 0 ||
            $scope.review.score === 0 ||
            $scope.review.content.length === 0;
    }


    function initReviewSection() {
        $scope.score = ''
        $scope.review = {
            name: '',
            content: '',
            dish: $routeParams.id,
            score: 0
        }
    }

    initReviewSection();
    $scope.reviewResult = {
        submitted: false
    };

    $scope.range = new Array(5); //max hearts possible

    $scope.addReview = function () {
        reviewService.CreateReview($scope.review).then(function (newReview) {
            $scope.reviews.push(newReview.data);
            initReviewSection();
            $scope.reviewResult = {
                submitted: true,
                message: 'Thank you for your review'
            }
        });
    }

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

app.controller('navCtrl', ['$scope', '$uibModal', '$location', function ($scope, $uibModal, $location) {

    $scope.isMainLocation = function () {
        return $location.path() === '/';
    }
}]);

app.controller('mainController', ['$scope', '$uibModal', 'dishService', function ($scope, $uibModal, dishService) {
    dishService.GetAllDishes(true).then(function (dish) {
        $scope.dish = dish.data;
    });

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
        });
    }
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
            });
        }
    };
});
