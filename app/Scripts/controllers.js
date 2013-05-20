var cntrl1=intelApp.controller('MainController',function($scope,instrumentFac){
    $scope.set=false
    console.log("done1")
  $scope.load =function(){
       console.log("done21")
       $scope.set=true
       var data=instrumentFac.get({symbol:$scope.input},function($scope){
           console.log('success, got data');
       }, function(err){
           alert('request failed');
       });
       data.$then(function(){
           console.log("yes + " + data.symbolName)
           $scope.instrumentData=data;
       })
   }




})

function MyCtrl1() {}
MyCtrl1.$inject = [];

