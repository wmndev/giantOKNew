'use strict';

app.directive('paypalButton', function() {
    return {
      restrict: 'E',
      scope: {
      },
      compile: function(element, attrs) {
        var languageCodes = [ // PayPal allowed language codes
          'en_US'
        ];
        var currencyCodes = [ // PayPal allowed currency codes
          'ILS',
          'USD'
        ];
        var buttonSizes = [ // PayPal allowed button sizes
          'SM', // small
          'LG' // large
        ];
        var name = this.name;
        function err(reason) {
          element.replaceWith('<span style="background-color:red; color:black; padding:.5em;">' + name + ': ' + reason + '</span>');
          console.log(element.context);
        }
        var action = attrs.action || 'https://www.paypal.com/us/cgi-bin/webscr';
        var business = attrs.business;
        var languageCode = attrs.languageCode || 'en_US';
        var currencyCode = attrs.currencyCode || 'USD';
        var itemName = attrs.itemName;
        var amount = parseFloat(attrs.amount);
        var buttonSize = attrs.buttonSize || 'SM';
        var imgAlt = attrs.imgAlt || 'Make payments with PayPal - it\'s fast, free and secure!';
        if (!business) { return err('business not specified!'); }
        if (!itemName) { return err('item name not specified!'); }
        if (!amount) { return err('amount not specified!'); }
        if (isNaN(amount)) { return err('amount is not a number!'); }
        if (languageCodes.indexOf(languageCode) < 0) { return err('unforeseen language code!'); }
        if (currencyCodes.indexOf(currencyCode) < 0) { return err('unforeseen currency code!'); }
        if (buttonSizes.indexOf(buttonSize) < 0) { return err('unforeseen button size!'); }
        var imgSrc = 'img/paypal_logo.gif';
        var template =
          '<form class="form-inline" name="_xclick" action="' + action + '" method="post">' +
          '<input type="hidden" name="cmd" value="_xclick">' +
          '<input type="hidden" name="business" value="' + business + '">' +
          '<input type="hidden" name="currency_code" value="' + currencyCode + '">' +
          '<input type="hidden" name="item_name" value="' + itemName + '">' +
          '<input type="hidden" name="amount" ng-value="quantity * 10.00">' +
//             '<input type="hidden" name="amount" value="0.01">' +
            '<input type="hidden" name="custom" ng-value="costumDataJson">' +
          '<button ng-disabled="isDisbleButton()" type="submit" type="button" class="btn btn-primary btn-md myOrderBtn">PAY WITH PAYPAL</button>' +
          '</form>';
        element.append(template);
      }
    };
  })
;
