angular.module("DirectivesApiRestfulPreIndex", ["ngResource"])
.factory("preindexRestfulService", function($resource){

    var url = "http://armand-arthur.com:8085/preindexapi/"; 
    //var url = "http://arthur.cv-angular-node.com:8085/api/"
    var preindexServiceRest = $resource(url+'inscription_crud', null, {});
    var preindexServiceRestItems  = $resource(
        url, 
        null, 
        {
            "getCategories" : { method: "GET", isArray: true, url: url+'categories'}
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
        }
    }
});
