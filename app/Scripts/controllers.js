var cntrl1=intelApp.controller('MainController',function($scope,instrumentFac){
    $scope.set=false
    console.log("done1")
  $scope.load =function(){
       console.log("done21")
       $scope.set=true
       var data=instrumentFac.get({which:"CLOSE",symbol:$scope.input},function($scope){
           console.log('success, got data');
       }, function(err){
           alert('request failed');
       });
       data.$then(function(){

           console.log("yes + " + data )

           $scope.instrumentData=data;
           var chartData=dataPrep($scope);


      $("#example-section2 #flotcontainer").highcharts('StockChart', {


          rangeSelector : {
              selected : 1
          },

          title : {
              text : $scope.instrumentData.symbolName+' Stock Price'
          },

          series : [{
              name : $scope.instrumentData.symbolName,
              data : chartData,
              tooltip: {
                  valueDecimals: 2
              }
          }]
      });
  });
      var dataPrep=function($scope){
          var startDate=new Date(Date.parse($scope.instrumentData.startDate));
          var endDate=new Date(Date.parse($scope.instrumentData.endDate));
          //endDate.setFullYear(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+3);
          var charted =[];
          var i=0;
          for(date=new Date(startDate.getTime());date<endDate;date.setDate(date.getDate()+1)){
             // console.log("start date "+ date )
              var dateTemp=Date.parse($scope.instrumentData.priceList[i].timeStamp);
              if(dateTemp.valueOf()==date.valueOf()){
                  charted.push([date.getTime(),$scope.instrumentData.priceList[i].closePrice]);
                  i++;
              }else{
                  charted.push([date.getUTCDate(),null]);
              }



          }



          return charted;
      }
   }

})





