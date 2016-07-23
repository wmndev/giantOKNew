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
