'use strict';

angular.module('platformWebApp')
    // TODO: Replace with tested localized version (see below)
    .directive('smartFloat', ['$filter', '$compile', function ($filter, $compile) {
        var INTEGER_REGEXP = /^\-?\d+$/; //Integer number
        var INTEGER_MAX_VALUE = 2147483647;
        var INTEGER_MIN_VALUE = -2147483648;
        var FLOAT_REGEXP_1 = /^[-+]?\$?\d{1,3}(\.\d{3})+(,\d*)$/; //Numbers like: 1.234,5678
        var FLOAT_REGEXP_2 = /^[-+]?\$?\d{1,3}(,\d{3})+(\.\d*)$/; //Numbers like: 1,234.5678
        var FLOAT_REGEXP_3 = /^[-+]?\$?\d+(\.\d*)?$/; //Numbers like: 1234.5678
        var FLOAT_REGEXP_4 = /^[-+]?\$?\d+(,\d*)?$/; //Numbers like: 1234,5678

        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var fraction = attrs.fraction ? attrs.fraction : 2;
                if (attrs.numType === "float") {
                    ctrl.$parsers.unshift(function (viewValue) {
                        if (FLOAT_REGEXP_1.test(viewValue)) {
                            ctrl.$setValidity('float', true);
                            return parseFloat(viewValue.replace('.', '').replace(',', '.'));
                        } else if (FLOAT_REGEXP_2.test(viewValue)) {
                            ctrl.$setValidity('float', true);
                            return parseFloat(viewValue.replace(',', ''));
                        } else if (FLOAT_REGEXP_3.test(viewValue)) {
                            ctrl.$setValidity('float', true);
                            return parseFloat(viewValue);
                        } else if (FLOAT_REGEXP_4.test(viewValue)) {
                            ctrl.$setValidity('float', true);
                            return parseFloat(viewValue.replace(',', '.'));
                        } else {
                            //Allow to use empty values
                            ctrl.$setValidity('float', !viewValue);
                            return viewValue;
                        }
                    });

                    ctrl.$formatters.unshift(
                        function (modelValue) {
                            return $filter('number')(parseFloat(modelValue), fraction);
                        }
                    );
                }
                else if (attrs.numType === "positiveInteger") {
                    ctrl.$parsers.unshift(function (viewValue) {
                        ctrl.$setValidity('positiveInteger', INTEGER_REGEXP.test(viewValue) && viewValue > 0);
                        return viewValue;
                    });
                }
                else {
                    ctrl.$parsers.unshift(function (viewValue) {
                        if (INTEGER_REGEXP.test(viewValue) && viewValue >= INTEGER_MIN_VALUE && viewValue <= INTEGER_MAX_VALUE) {
                            ctrl.$setValidity('integer', true);
                            return viewValue;
                        }
                        else {
                            //Allow to use empty values
                            ctrl.$setValidity('integer', !viewValue);
                            return viewValue;
                        }
                    });
                }
            }
        };
    }]);
