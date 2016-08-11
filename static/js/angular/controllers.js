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
            console.log(activeOrders);
            activeOrders.data.forEach(function (item) {
                if ($scope.data.indexOf(item.email)==-1)
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
                if ($scope.data.indexOf(item.email)==-1)
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

        emailService.SendEmail(data).then();
    }

}

app.controller('orderController', ['$scope', '$http', 'dishService', 'orderService', '$localStorage', function ($scope, $http, dishService, orderService, $localStorage) {
    $scope.dish = dishService.GetDish();

    $scope.submitOrder = function () {
        var dataObj = {
            email: $scope.email,
            comments: $scope.comments,
            status: 'Intial',
            payment: 1,
            dishName: $scope.dish.name,
            amount: 10
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

app.controller('navCtrl', ['$scope', '$uibModal', '$location','subscriberService', function ($scope, $uibModal, $location, subscriberService) {

    $scope.isMainLocation = function () {
        return $location.path() === '/';
    }

   $scope.subscribeUser = function () {
       console.log('in sub');
        var dataObj = {
            email: $scope.email
        };


            subscriberService.Subscribe(dataObj).then(function (data) {
                $scope.success = true;
                console.log('done sub');
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


app.controller('confirmationController', ['$scope', '$location', 'orderService', function ($scope, $location, orderService) {

    /*
    Typical returned URL:
        http://127.0.0.1:3000/#/order/confirmation/paypal?amt=0.01&cc=USD&charset=windows-1252&cm=%7B%22comments%22:%22mycommets!!%22,%22email%22:%22itaywiseman@gmail.com%22%7D&item_name=BLACK%20BEAN%20%26%20CHEESE%20ENCHILADA&st=Completed&tx=0J18242325718591X
    */

    $scope.result = {
        success: false,
        msg: ''
    };


    var params = $location.search();

    var st = params.st;
    var tx = params.tx;

    if (st === '' || st === undefined || tx === '' || tx === undefined) {
            $scope.result.success = false;
            $scope.result.msg = 'Something went wrong here!!\n' +
                'Are you sure you have completed the process with PayPal..?';
    } else {
        var userDetails = JSON.parse($location.search().cm);
        var dishName = params.item_name;

        var params = {
            email: userDetails.email,
            comments: userDetails.comments,
            status: 'Initial',
            payment: 2,
            dishName: dishName,
            amount: params.amt
        };
        createNewOrder(params);
    }

    function createNewOrder(params) {
        orderService.SubmitOrder(params).then(function (data) {
            $scope.result.success = true;
            $scope.result.msg = 'Your order was submitted successfully! \n You should recieve an email confirmation to: ' +
                params.email + ' shortly.'
        }, function (err) {
            $scope.result.success = false;
            $scope.result.msg = 'Something went wrong here!!\n' +
                'Do not worry, your order is safe with us and will be ready on time - Just CONTACT the CHEF PLEASE!'
        });
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
