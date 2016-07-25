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

app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $('body').animate({scrollTop: $target.offset().top}, 'slow');
      });
    }
  }
});
