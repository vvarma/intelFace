var intelApp=angular.module('intel',['ngResource']).
    config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/chart', {templateUrl: 'partials/plotInstrument.html',   controller: MyCtrl1}).
        otherwise({redirectTo: '/'});
}]);;