app.config(function ($routeProvider) {
    //$rootScope.isAuth = false;

    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController',
            authenticated: false
        })
        .when('/dishes', {
            templateUrl: 'dishes.html',
            controller: 'dishesController',
            authenticated: false
        })
        .when('/dishes/:id', {
            templateUrl: 'selectedDish.html',
            controller: selectedDishCtrl,
            authenticated: false
        })
        .when('/admin/dishes', {
            templateUrl: 'adminDishes.html',
            controller: 'adminDishCtrl',
            authenticated: true
        })
        .when('/admin/console', {
            templateUrl: 'adminConsole.html',
            authenticated: true
        })
        .when('/admin/orders', {
            templateUrl: 'adminOrders.html',
            controller: adminOrders,
            authenticated: true
        })
        .when('/admin/notifications', {
            templateUrl: 'adminNotifications.html',
            controller: adminNotifications,
            authenticated: true
        })
        .when('/order', {
            templateUrl: 'order.html',
            controller: 'orderController',
            authenticated: false
        })
        .when('/user/LoginUser', {
            templateUrl: 'loginUser.html',
            controller: loginController,
            authenticated: false
        });
});
