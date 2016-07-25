app.service('dishService', ['$http', function ($http) {

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
            return dish.data;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }


    this.SubmitDishes = function (dishes) {
        console.log(dishes);
        $http.post('api/dishes', dishes).then(function (data) {
            console.log(data);
        }, function (err) {
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
        var promise = $http.post('api/order', order).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

}]);


app.service('subscriberService', ['$http', function ($http) {

    this.Subscribe = function (details) {
        var promise = $http.post('api/subscribe', details).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

}]);

app.service('reviewService', ['$http', function($http){

    this.GetAllReviews = function (id){
        console.log('dishid:' + id);
        var promise = $http.get('/api/review/' + id).then(function (reviews) {
            return reviews.data;
        }, function (err) {
            console.log(err);
        });
        return promise;
    }

    this.CreateReview = function(review){
        var promise = $http.post('api/review', review).then(function (data) {
            return data;
        }, function (err) {
            console.log(err);
        });

        return promise;
    }

}]);
