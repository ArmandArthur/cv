angular.module("DirectivesApiRestfulPreIndex", ["ngResource"])
.factory("preindexRestfulService", function($resource){

    //var url = "http://armand-arthur.com:8085/api/"; 
    var url = "http://arthur.cv-angular-node.com:8085/api/"
    var preindexServiceRest = $resource(url+'inscription_crud', null, {});

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
        }
    }
});