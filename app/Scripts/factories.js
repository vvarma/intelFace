intelApp.factory("instrumentFac",function($resource){
    var resource=$resource('http://localhost\\:8080/analyser/load/:symbol');
    return resource;
})
intelApp.factory("portfoliosFac",function($resource){
    var resource=$resource('http://localhost\\:8080/portfolio/listAll');
    return resource;
})
intelApp.factory("portFac",function($resource){
    var resource=$resource('http://localhost\\:8080/portfolio/load/:portfolio');
    return resource;
})
