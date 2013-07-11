intelApp.factory("instrumentFac",function($resource){
    return $resource('http://localhost\\:8080/analyser/load/:symbol');
});
intelApp.factory("portfoliosFac",function($resource){
    return $resource('http://localhost\\:8080/portfolio/listAll');
});
intelApp.factory("portFac",function($resource){
    return $resource('http://localhost\\:8080/portfolio/load/:portfolio');
});
