/**
 * Created with JetBrains WebStorm.
 * User: vvarm1
 * Date: 7/25/13
 * Time: 2:19 PM
 * To change this template use File | Settings | File Templates.
 */

var traderApp = angular.module("trader", ['ngResource']).
    directive('datepicker', function($parse) {
    var directiveDefinitionObject = {
        restrict: 'A',
        link: function postLink(scope, iElement, iAttrs) {
            iElement.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function(dateText, inst) {
                    scope.$apply(function(scope){
                        $parse(iAttrs.ngModel).assign(scope, dateText);
                    });
                }
            });
        }
    };
    return directiveDefinitionObject;
});;

traderApp.factory("portfoliosFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/portfolio/listAll');
});
traderApp.factory("portfolioFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/portfolio/load/:portfolio');
});
traderApp.factory("createPortfolioFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/portfolio/create/:portfolio/:strategy/:strategyArr');
});
traderApp.factory("legalIndicatorsFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/analyser/legalIndicators');
});
traderApp.factory("addInvestmentFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/portfolio/addInvestment/:portfolioName/:symbolName');
});
traderApp.factory("instrumentFac",function($resource){
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/analyser/load/:symbol');
});
traderApp.factory("globalGetTimeFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/global/getTime');
});
traderApp.factory("globalSetTimeFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/global/setTime/:today');
});
traderApp.factory("portfolioUpdateFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/portfolio/updatePortfolio/:portfolioName');
});
traderApp.factory("portfolioRollFac", function ($resource) {
    return $resource('http://localhost\\:8080/intelTrader-1.0-SNAPSHOT/test/portfolio/rollPortfolio/:portfolioName/:rollDate');
});

var cntrl1 = traderApp.controller("cntrl1", function ($scope, portfoliosFac, portfolioFac,createPortfolioFac,legalIndicatorsFac,addInvestmentFac,instrumentFac,globalGetTimeFac,globalSetTimeFac,portfolioUpdateFac,portfolioRollFac) {

    $scope.onPageLoad = function () {
        $scope.title = "INTEL TRADER";

        $scope.boolInvestment = false;
        $scope.boolAddPortfolio = false;
        $scope.boolAddInvestment = false;
        $scope.boolSymbol = false;
        $scope.selectedPortfolioName = "";
        $scope.today = "";
        $scope.portfolios = {};
        $scope.selectedPortfolio = {};
        $scope.setRoll=false;
        listPortfolios($scope);
        getLegalIndicators($scope);
        getToday($scope);
    }
    function listPortfolios($scope) {
        var data = portfoliosFac.get({}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        data.$then(function () {
            console.log(data.portfolio);
            $scope.portfolios = {
                names:data.portfolio
            };

        })


    }
    function getLegalIndicators($scope){
        var data = legalIndicatorsFac.get({}, function () {
            console.log('legal success, got data');
        }, function () {
            alert('request failed');
        });

        data.$then(function(){
            console.log("yo"+data.indicators[0]);
            var strategies=[];
            if ( data.indicators.length>0)
                for(var i=0;i<data.indicators.length;i++){
                   strategies[i]={
                       name:data.indicators[i],
                       checked:false
                   };
                }
            console.log(strategies)
            $scope.strategies={
                val:strategies
            };

        })
    }
    function getToday($scope){
        var data=globalGetTimeFac.get({}, function () {
            console.log('global success, got data' + data.today);

        }, function () {
            alert('request failed');
        })
        data.$then(function(){

            $scope.today = data.today;
        })

    };
    function rollPortfolio($scope){
        console.log("Set Roll")
        var data=portfolioRollFac.get({portfolioName:$scope.selectedPortfolioName,rollDate:$scope.today},function(){
            console.log("update portfolio complete");
        },function(){
            alert("update not so successful");
        })
        data.$then(function(){
            $scope.loadPortfolio();
        })
    }
    function updatePortfolio($scope){

            var data=portfolioUpdateFac.get({portfolioName:$scope.selectedPortfolioName},function(){
                console.log("update portfolio complete");
            },function(){
                alert("update not so successful");
            })
            data.$then(function(){
                $scope.loadPortfolio();
            })
    }
    $scope.loadPortfolio = function () {
        var data = portfolioFac.get({portfolio:$scope.selectedPortfolioName}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        data.$then(function () {
            $scope.selectedPortfolio = data;
            if($scope.selectedInvestment!=null){
                console.log("here123 not nul")
                $scope.forInvestment($scope.selectedInvestment.symbolName)
            }
        })
    }
    $scope.showPortfolio = function () {
        $scope.boolInvestment = !$scope.boolInvestment;
    }
    $scope.showAddPortfolio = function () {
        $scope.boolAddPortfolio = !$scope.boolAddPortfolio;
    }
    $scope.showAddInvestment= function () {
        $scope.boolAddInvestment = !$scope.boolAddInvestment;
    }

    $scope.createPortfolio=function(){
        var token="";
        for(var i=0;i<$scope.strategies.val.length;i++){
            console.log($scope.strategies.val[i])
            if($scope.strategies.val[i].checked==true){
                token=token+$scope.strategies.val[i].name+"-";
            }
        }
        console.log($scope.newPortfolioName);
        if(token==""){
            alert("please select atleast one strategy")
        }else{
            createPortfolioFac.get({portfolio:$scope.newPortfolioName,strategy:token},function () {
                console.log('success, got data');
                listPortfolios($scope);
                $scope.selectedPortfolioName=$scope.newPortfolioName;
                $scope.loadPortfolio();
            }, function () {
                alert('request failed');
            })
        }
    }
    $scope.addInvestment=function(){
        var data=addInvestmentFac.get({portfolioName:$scope.selectedPortfolioName,symbolName:$scope.symbolName},function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        data.$then(function(){
            $scope.loadPortfolio();
        })

    }
    $scope.plotInvestment=function(symbolName){
        var data = instrumentFac.get({symbol:symbolName}, function () {
            console.log('success, got data');
        }, function () {
            alert('request failed');
        });
        data.$then(function () {
            console.log("yes + " + data);
            $scope.instrumentData = data;
            $scope.plot();
        });
    }
    $scope.plot = function () {
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
                    height:200
                }
            ],
            series:[
                {
                    name:$scope.instrumentData.symbolName + " Price",
                    data:chartData,
                    tooltip:{
                        valueDecimals:2
                    },
                    yAxis:0
                }
            ]

        });
    };
    $scope.forInvestment=function(symbolName){
        console.log(symbolName)
        for(var i=0;i< $scope.selectedPortfolio.investmentList.length;i++){
            if(symbolName==$scope.selectedPortfolio.investmentList[i].symbolName){
                $scope.selectedInvestment=$scope.selectedPortfolio.investmentList[i];
            }
        }

        $scope.boolSymbol=!$scope.boolSymbol;
        $scope.boolPlotOrTransaction=false;
        $scope.plotOrTransaction="plot";
        $scope.plotInvestment(symbolName);


    };
    $scope.plotOrTransactionFn=function(){
        $scope.boolPlotOrTransaction=!$scope.boolPlotOrTransaction;
        if($scope.boolPlotOrTransaction)
            $scope.plotOrTransaction="transactions";
        else
            $scope.plotOrTransaction="plot";
    };
    $scope.setToday=function(){
        console.log("wassa" + $scope.setRoll)
        console.log($scope.today);
        if($scope.setRoll){
            rollPortfolio($scope);

        }else{
            var data=globalSetTimeFac.get({today:$scope.today},function(){
                console.log("setting date");
            },function(){
                alert("god damn man!")
            })
            data.$then(function(){
                if($scope.selectedPortfolioName!=null){
                    updatePortfolio($scope);
                }
                getToday($scope);
            })
        }


    }

})

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
};