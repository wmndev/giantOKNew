app.service('dishService', ['$http', function ($http) {

    var selectedDish;

    this.GetDish = function () {
        return selectedDish;
    }

    this.GetAllDishes = function (isWeekly) {
        var params = {};
        if (typeof isWeekly !== 'undefined' &&
            isWeekly !== null &&
            typeof isWeekly === 'boolean') {
            params.isWeekly = isWeekly;
        }

        var promise = $http({
            method: 'GET',
            url: '/api/dishes',
            params: params
        }).
        then(function (data) {
            return data;
        });
        return promise;
    }

    this.GetSelectedDish = function (id) {
        var promise = $http.get('/api/dishes/' + id).then(function (dish) {
            selectedDish = dish.data;
            return dish.data;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }


    this.SubmitDishes = function (dishes) {
        $http.post('api/dishes', dishes).then(function (data) {}, function (err) {
            console.log(err);
        });
    }
   }]);


app.service('orderService', ['$http', function ($http) {
    this.GetOrders = function (isActive) {
        var params = {};
        if (typeof isActive !== 'undefined' &&
            isActive !== null &&
            typeof isActive === 'boolean') {
            params.active = isActive;
        }
        var promise = $http({
            method: 'GET',
            url: '/api/orders',
            params: params
        }).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

    this.SubmitOrder = function (order) {
        var promise = $http.post('api/orders', order).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }

    this.DeactivateOrders = function () {
        var promise = $http.patch('api/orders').then(function (data) {}, function (err) {
            console.log(err);
        });
        return promise;
    }

}]);


app.service('subscriberService', ['$http', function ($http) {

    this.Subscribe = function (details) {
        var promise = $http.post('api/subscribes', details).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

    this.GetAllSubscribers = function () {
        var promise = $http.get('api/subscribes').then(function (data) {
            return data;
        }, function (error) {
            console.log(error);
        });
        return promise;
    }

}]);

app.service('emailService', ['$http', function ($http) {
    this.SendEmail = function (data) {
        var promise = $http.post('/api/email/', data).then(function (response) {
            return response;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }

}]);

app.service('reviewService', ['$http', function ($http) {

    this.GetAllReviews = function (id) {
        var promise = $http.get('/api/review/' + id).then(function (reviews) {
            return reviews.data;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }

    this.CreateReview = function (review) {
        var promise = $http.post('api/review', review).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

}]);


app.service('authenticationService', ['$http', '$rootScope', function($http, $rootScope){
    this.AuthenticateUsingCredentials = function(username, password){
        var isAuth =  username === 'giantok' &&
            password === 'Zoobie1';
        $rootScope.isAuth = isAuth;
        return isAuth;
    }
}]);
