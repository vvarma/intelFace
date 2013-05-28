intelApp.factory("instrumentFac",function($resource){
    var resource=$resource('http://localhost\\:8080/analyser/load/:symbol');
    return resource;
})
