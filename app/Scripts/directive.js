intelApp.directive('chart', function() {
    console.log("plot strt")
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            var data = scope[attrs.ngModel];
            $.plot(elem, data, {});
            elem.show();
            console.log("plot end")
        }
    };
});