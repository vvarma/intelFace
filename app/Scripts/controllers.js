var cntrl1=intelApp.controller('MainController',function($scope,instrumentFac){
    $scope.set=false
    console.log("done1")
  $scope.load =function(){
       console.log("done21")
       $scope.set=true
       var data=instrumentFac.get({which:"Close",symbol:$scope.input},function($scope){
           console.log('success, got data');
       }, function(err){
           alert('request failed');
       });
       data.$then(function(){

           console.log("yes + " + data )

           $scope.instrumentData=data;
           var chartData=dataPrep($scope);
           var options = {
               series:{
                   lines:{
                       show:true
                   }
               },
               xaxis:{
                   mode:"time",
                   timeformat: "%Y/%m",
                   minTickSize: [1, "month"]
               }
           };
           $.plot($("#example-section2 #flotcontainer"), [
               { data: chartData }
           ], options);
       })
      var dataPrep=function($scope){
          var startDate=new Date(Date.parse($scope.instrumentData.startDate));
          var endDate=new Date(Date.parse($scope.instrumentData.endDate));
          //endDate.setFullYear(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+3);
          var charted =[];
          var i=0;
          for(date=new Date(startDate.getTime());date<endDate;date.setDate(date.getDate()+1)){
              console.log("start date "+ date )
              if($scope.instrumentData.priceList[i]!=null)
                  charted.push([new Date(date.getTime()),$scope.instrumentData.priceList[i]]);
              i++;
          }



          return charted;
      }
   }

})





