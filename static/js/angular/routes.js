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
        })
        .when('/admin/console', {
            templateUrl: 'adminConsole.html',
        })
        .when('/admin/orders', {
            templateUrl: 'adminOrders.html',
            controller: adminOrders
        });
});
