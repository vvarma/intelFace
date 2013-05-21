intelApp.factory("instrumentFac",function($resource){
    var resource=$resource('http://localhost\\:8080/instrument/loadWhich/:which/:symbol');
    return resource;
})
