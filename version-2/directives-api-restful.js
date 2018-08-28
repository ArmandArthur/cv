angular.module("DirectivesApiRestful", ["ngResource"])
.factory("restfulService", function($resource){

    var url = "http://localhost:8084/api/";
    var serviceRest  = $resource(
        url, 
        null, 
        {
            "getCategories" : { method: "GET", isArray: true, url: url+'categories'},
            "getFrameworksByCategorieValue" : { method: "GET", isArray: true, url :url+'categorie/:categorie_label/frameworks'},

            //"getCategorieStructure" :  { method: "GET", isArray: false, url : url+'categorie_structure'}
            //"getFrameworks" : { method: "GET", isArray: false, url : url_api+'frameworks'}
            //"categorie" : { method: "GET", isArray: false, url: url+'categorie/:id'}
        }
    );

    var categorieServiceRest = $resource(url+'categorie_crud', null, {update: {method: 'PUT'}});

    var frameworkServiceRest = $resource(url+'framework_crud', null, {update: {method: 'PUT'}});

    return {
        getCategories : function(){
            return serviceRest.getCategories().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        categorie : function(categorie){


            return categorieServiceRest.get(categorie).$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        getFrameworksByCategorieValue: function(categorie_label){
            return serviceRest.getFrameworksByCategorieValue({categorie_label: categorie_label}).$promise
            .then(
                function(data) {
                    return data;
                },
                function(error) {
                    console.info(error);
                    return 'error';
                } 
            );
        }
        ,
        framework : function(framework){


            return frameworkServiceRest.get(framework).$promise
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