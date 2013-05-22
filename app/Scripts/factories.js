intelApp.factory("instrumentFac",function($resource){
    var resource=$resource('http://localhost\\:8080/instrument/load/:symbol');
    return resource;
})
