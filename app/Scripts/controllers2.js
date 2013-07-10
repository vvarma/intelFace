/**
 * Created with JetBrains WebStorm.
 * User: vvarm1
 * Date: 7/8/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */

var cntrl1 = intelApp.controller('MainController', function ($scope, instrumentFac,portfoliosFac,portFac,$location) {
    $scope.set = false;
    $scope.bla="phiss";
    console.log("done1");
    $scope.loadPortfolios = function () {
        console.log("i am called");
        var data=portfoliosFac.get({}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        console.log("here 1")
        data.$then(function(){

            console.log("data retrieved" + data.portfolio)
            var argh=[];

            for(var i=0;i<data.portfolio.length;i++){
                argh[i]=data.portfolio[i];
                console.log(argh[i])
            }
            var portfolios={
                names:argh
            }
            $scope.bla="blah"
            $scope.portfolios=portfolios;
            console.log($scope.portfolios.names)
            $("#portSelect").show();

        });

    };
    $scope.lol=function(){
        console.log("lol" + $scope.portfolioSelect)
    }

    $scope.getPortfolio=function(){
        console.log("Portfolio Selected" + $scope.portfolioSelect);
        var data=portFac.get({portfolio:$scope.portfolioSelect}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        })
        data.$then(function(){
            $scope.portfolio=data;
            console.log("yo "+ $scope.portfolio.investmentList[0].symbolName)

        })


    };
    $scope.load = function () {
        console.log("done21")
        $scope.set = true;
        var data = instrumentFac.get({symbol:$scope.input}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        data.$then(function () {
            console.log("yes + " + data)
            $scope.instrumentData = data;

        });
        $("#view1").show();
    };
    $scope.plot=function(){
        var chartData = dataPrep($scope);
        $("#chartContainer #macdChart").highcharts('StockChart', {

            rangeSelector:{
                selected:1
            },
            title:{
                text:$scope.instrumentData.symbolName + ' Stock Price'
            },
            yAxis:[
                {
                    title:{
                        text:"Price"
                    },
                    height: 200
                }],
            series:[
                {
                    name:$scope.instrumentData.symbolName + " Price",
                    data:chartData,
                    tooltip:{
                        valueDecimals:2
                    },
                    yAxis: 0
                } ]

        });
    }
    /*console.log("ayyyo" +$scope.portfolioSelect);
    if($scope.portfolioSelect !="" &&$scope.portfolioSelect!="unselect"){
        console.log("dai" +$scope.portfolioSelect);
        getPortfolio();
    }else{
        console.log("no dai"+$scope.portfolioSelect +" p")
    }*/

});

var dataPrep = function ($scope) {
    var startDate = new Date(Date.parse($scope.instrumentData.startDate));
    var endDate = new Date(Date.parse($scope.instrumentData.endDate));
    //endDate.setFullYear(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+3);
    var charted = [];
    var i = 0;
    for (date = new Date(startDate.getTime()); date < endDate; date.setDate(date.getDate() + 1)) {
        // console.log("start date "+ date )
        var dateTemp = Date.parse($scope.instrumentData.priceList[i].timeStamp);
        if (dateTemp.valueOf() == date.valueOf()) {
            charted.push([date.getTime(), $scope.instrumentData.priceList[i].closePrice]);
            i++;
        }
    }
    return charted;
}

