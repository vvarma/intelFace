var cntrl1 = intelApp.controller('ChartController', function ($scope, instrumentFac) {
    $scope.set = false
    console.log("done1")
    $scope.load = function () {
        console.log("done21")
        $scope.set = true
        var data = instrumentFac.get({which:"CLOSE", symbol:$scope.input}, function ($scope) {
            console.log('success, got data');
        }, function (err) {
            alert('request failed');
        });
        data.$then(function () {
            console.log("yes + " + data)
            $scope.instrumentData = data;
            var chartData = dataPrep($scope);
            var macdChartData =[];
            var macdSignalData=[];
            var macdHistData=[];
            var rsiData=[];
            var bbandUpperData=[];
            var bbandLowerData=[];
            var bbandMiddleData=[];

            macdDataPrep($scope,macdChartData,macdHistData,macdSignalData);
            rsiDataPrep($scope,rsiData);
            bbandDataPrep($scope,bbandUpperData,bbandLowerData,bbandMiddleData);
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
                    },
                    {
                        title:{
                            text:"MACD"
                        },
                        top: 300,
                        height: 100,
                        offset: 0
                    },
                    {
                        title:{
                            text:"RSI"
                        },
                        top: 300,
                        height: 100,
                        offset: 0
                    },
                    {
                        title:{
                            text:"BBAND"
                        },
                        top: 300,
                        height: 100,
                        offset: 0
                    }
                ],
                series:[
                    {
                        name:$scope.instrumentData.symbolName + " Price",
                        data:chartData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 0
                    },{
                        name:$scope.instrumentData.symbolName + " MACD",
                        data:macdChartData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 1
                    },{
                        name:$scope.instrumentData.symbolName + " MACDSignal",
                        data:macdSignalData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 1
                    },{
                        name:$scope.instrumentData.symbolName + " MACDHist",
                        data:macdHistData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 1,
                        type:'column'
                    },
                    {
                        name:$scope.instrumentData.symbolName + " RSI",
                        data:rsiData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 2,
                        type:'column'
                    },
                    {
                        name:$scope.instrumentData.symbolName + " BBandUpper",
                        data:bbandUpperData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 3,
                        type:'column'
                    },
                    {
                        name:$scope.instrumentData.symbolName + " BBandMiddle",
                        data:bbandMiddleData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 3,
                        type:'column'
                    },
                    {
                        name:$scope.instrumentData.symbolName + " BBandLower",
                        data:bbandLowerData,
                        tooltip:{
                            valueDecimals:2
                        },
                        yAxis: 3,
                        type:'column'
                    }

                ]

            });
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

        var macdDataPrep = function ($scope,macdChartData,macdHistData,macdSignalData) {
            var startDate = new Date(Date.parse($scope.instrumentData.startDate));
            var endDate = new Date(Date.parse($scope.instrumentData.endDate));
            var i = 0;
            for (date = new Date(startDate.getTime()); date < endDate; date.setDate(date.getDate() + 1)) {
                // console.log("start date "+ date )
                var dateTemp = Date.parse($scope.instrumentData.priceList[i].timeStamp);
                if (dateTemp.valueOf() == date.valueOf()) {
                    macdChartData.push([date.getTime(), $scope.instrumentData.extras['MACD'][i]]);
                    macdHistData.push([date.getTime(), $scope.instrumentData.extras['MACDHist'][i]]);
                    macdSignalData.push([date.getTime(), $scope.instrumentData.extras['MACDSignal'][i]]);

                    i++;
                }
            }

        }
        var rsiDataPrep = function ($scope,rsiData) {
            var startDate = new Date(Date.parse($scope.instrumentData.startDate));
            var endDate = new Date(Date.parse($scope.instrumentData.endDate));
            //endDate.setFullYear(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+3);
            var charted = [];
            var i = 0;
            for (date = new Date(startDate.getTime()); date < endDate; date.setDate(date.getDate() + 1)) {
                // console.log("start date "+ date )
                var dateTemp = Date.parse($scope.instrumentData.priceList[i].timeStamp);
                if (dateTemp.valueOf() == date.valueOf()) {
                    rsiData.push([date.getTime(), $scope.instrumentData.extras['RSI'][i]]);
                    i++;
                }
            }
            return charted;
        }
        var bbandDataPrep = function ($scope,bbandUpperData,bbandLowerData,bbandMiddleData) {
            var startDate = new Date(Date.parse($scope.instrumentData.startDate));
            var endDate = new Date(Date.parse($scope.instrumentData.endDate));
            //endDate.setFullYear(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+3);
            var charted = [];
            var i = 0;
            for (date = new Date(startDate.getTime()); date < endDate; date.setDate(date.getDate() + 1)) {
                // console.log("start date "+ date )
                var dateTemp = Date.parse($scope.instrumentData.priceList[i].timeStamp);
                if (dateTemp.valueOf() == date.valueOf()) {
                    bbandUpperData.push([date.getTime(), $scope.instrumentData.extras['BBANDUpper'][i]]);
                    bbandLowerData.push([date.getTime(), $scope.instrumentData.extras['BBANDLower'][i]]);
                    bbandMiddleData.push([date.getTime(), $scope.instrumentData.extras['BBANDMiddle'][i]]);
                    i++;
                }
            }
            return charted;
        }
    }

})





