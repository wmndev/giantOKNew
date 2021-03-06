function loginController($scope, $location, authenticationService) {

    $scope.authenticate = function () {
        var isAuth = authenticationService.AuthenticateUsingCredentials($scope.username, $scope.password);
        if (isAuth) {
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

    $scope.updateOrders = function () {
        $scope.orders.forEach(function (order) {
            if (order.complete) {
                orderService.updateOrder(order.id, true, false).then(function (data) {
                    getOrders(false);
                });
            }
        });

    }

    $scope.getOrders = getOrders;
}

function adminNotifications($scope, orderService, subscriberService, emailService) {

    var messages = {
        orderPrepared: {
            subject: 'GiantOK - Your order is being prepared',
            content: '<h3><b>Dear customer,</b></h3>' +
                '<p>Just letting you know that your order is being prepared</p><br>' +
                '<p>We appriciate your business, <br> Yuval and the team</p><br>' +
                '<a href="https://giantok.herokuapp.com">GiantOK</a>, Make Lunch Great Again!'
        },
        orderReady: {
            subject: 'GiantOK - Your orderis waiting for you in the kitchen',
            content: '<h3><b>Dear customer,</b></h3>' +
                '<p>Just letting you know that your order is ready and waiting for you in the kitchen</p><br>' +
                '<p>We appriciate your business, <br> Yuval and the team</p><br>' +
                '<a href="https://giantok.herokuapp.com">GiantOK</a>, Make Lunch Great Again!'
        },
        costumize: {
            subject: 'GiantOK - An important message from your chef',
            content: 'Enter your content'
        }
    };



    $scope.getActiveEmails = function (action) {
        $scope.data = [];
        orderService.GetOrders(true).then(function (activeOrders) {
            activeOrders.data.forEach(function (item) {
                if ($scope.data.indexOf(item.email) == -1)
                    $scope.data.push(item.email);
            });

            $scope.action = action;
            if (action === 'Prepared') {
                $scope.message = messages.orderPrepared.content;
                $scope.subject = messages.orderPrepared.subject;
            } else {
                $scope.message = messages.orderReady.content;
                $scope.subject = messages.orderReady.subject;
            }
        }, function (err) {
            console.log(err);
        });
    }

    $scope.getAllSubscribers = function (action) {
        $scope.data = [];
        subscriberService.GetAllSubscribers().then(function (subscribers) {
            subscribers.data.forEach(function (item) {
                if ($scope.data.indexOf(item.email) == -1)
                    $scope.data.push(item.email);
            });

            $scope.action = action;
            $scope.message = messages.costumize.content;
            $scope.subject = messages.costumize.subject;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.sendMail = function () {
        var data = {
            content: $scope.message,
            to: $scope.data,
            action: $scope.action,
            subject: $scope.subject
        }

        console.log(data);

        emailService.SendEmail(data).then(function (data) {
            console.log('OK - sent email:' + data);
        }, function (err) {
            console('Error - sent email:' + err);
        });
    }

}

app.controller('orderController', ['$scope', '$rootScope', '$http', 'dishService', 'orderService', '$localStorage', '$location', function ($scope, $rootScope, $http, dishService, orderService, $localStorage, $location) {
    $scope.dish = dishService.GetDish();

    $scope.submitOrder = function () {
        var dataObj = {
            email: $scope.email,
            comments: $scope.comments,
            status: 'Intial',
            payment: 0,
            dishName: $scope.dish.name,
            amount: ($scope.quantity * 12)
        };
        $scope.result = {
            success: false,
            msg: ''
        };

        $scope.submitted = true;
        orderService.SubmitOrder(dataObj).then(function (data) {
            $rootScope.order = data.data;

            $location.path('/order/confirmation');
        }, function (err) {
            $scope.success = false;
        });
    };

    $scope.isDisbleButton = function () {
        return ($scope.email === '' || $scope.email === undefined);
    };

    var costumData = {};

    $scope.costumDataJson = '';

    //$watches
    //--------
    $scope.$watch('comments', function () {
        costumData.comments = $scope.comments;
        $scope.costumDataJson = JSON.stringify(costumData);
        console.log($scope.costumDataJson);
    });

    $scope.$watch('email', function () {
        costumData.email = $scope.email;
        $scope.costumDataJson = JSON.stringify(costumData);
        console.log($scope.costumDataJson);
    });
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
            $scope.review.content.length === 0 || $scope.charsLeft < 0;
    }


    function initReviewSection() {
        $scope.charsLeft = 255;
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
    };

    $scope.writingReview = function () {
        $scope.charsLeft = (255 - $scope.review.content.length);
    };

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

app.controller('navCtrl', ['$scope', '$uibModal', '$location', 'subscriberService', function ($scope, $uibModal, $location, subscriberService) {

    $scope.isMainLocation = function () {
        return $location.path() === '/';
    }

    $scope.subscribeUser = function () {
        var dataObj = {
            email: $scope.email
        };


        subscriberService.Subscribe(dataObj).then(function (data) {
            $scope.success = true;
        });
    };

}]);

app.controller('mainController', ['$scope', '$uibModal', 'dishService', function ($scope, $uibModal, dishService) {

    dishService.GetAllDishes(true).then(function (dish) {
        $scope.dish = dish.data;
    });

    $scope.items = ['item1', 'item2'];
    $scope.open = function (size, isOrder) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'content/subscribe.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            //            windowClass: 'center-modal',
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


app.controller('confirmationController', ['$scope', '$rootScope', '$location', 'orderService', function ($scope, $rootScope, $location, orderService) {

    /*
    PAYPAL: Typical returned URL:
        http://127.0.0.1:3000/#/order/confirmation/paypal?amt=0.01&cc=USD&charset=windows-1252&cm=%7B%22comments%22:%22mycommets!!%22,%22email%22:%22itaywiseman@gmail.com%22%7D&item_name=BLACK%20BEAN%20%26%20CHEESE%20ENCHILADA&st=Completed&tx=0J18242325718591X
    */

    $scope.result = {
        isDone: false,
        success: false,
        msg: ''
    };

    if ($rootScope.order !== undefined) {
        $scope.totalAmt = $rootScope.order.amount;
        $scope.dishName = $rootScope.order.dishName;
    }

    if ($location.path().indexOf('paypal') > 0) {
        showCompleteDetails();
    }

    $scope.completeTransaction = function (isPayPal) {
        if (isPayPal) {
            var costumData = {
                id: $rootScope.order.id
            };
            $scope.costumDataJson = JSON.stringify(costumData);
        }
        orderService.updateOrder($rootScope.order.id, isPayPal, isPayPal).then(
            function (data) {
                if (!isPayPal) {
                    showCompleteDetails();
                }
            });
    }

    function showCompleteDetails() {
        $scope.result.isDone = true;
        $scope.result.msg = 'Your order was submitted successfully!';
        $scope.result.success = true;
    }
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
