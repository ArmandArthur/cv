angular.module("DirectivesApiRestfulPreIndex", ["ngResource"])
.factory("preindexRestfulService", function($resource){

    var url = "http://armand-arthur.com:8085/preindexapi/"; 
    var preindexServiceRest = $resource(url+'inscription_crud', null, {});
    var preindexServiceRestLogin = $resource(url+'login', null, {});
    var preindexServiceRestItems  = $resource(
        url, 
        null, 
        {
            "getCategories" : { method: "GET", isArray: true, url: url+'categories'},
            "getFrameworks" : { method: "GET", isArray: true, url: url+'frameworks'},
        }
    );
    return {
        inscription : function(inscription){


            return preindexServiceRest.save(inscription).$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        login : function(login){


            return preindexServiceRestLogin.save(login).$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },        
        getCategories : function(){
            return preindexServiceRestItems.getCategories().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        getFrameworks : function(){
            return preindexServiceRestItems.getFrameworks().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        }        
    }
});
