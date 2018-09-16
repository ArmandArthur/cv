angular.module("DirectivesApiRestful", ["ngResource"])
.factory("restfulService", function($resource){

    var url = "http://51.38.185.177/api/";
    var serviceRest  = $resource(
        url, 
        null, 
        {
            "getCategories" : { method: "GET", isArray: true, url: url+'categories'},
            "getFrameworks" : { method: "GET", isArray: true, url: url+'frameworks'},
            "getExperiences" : { method: "GET", isArray: true, url: url+'experiences'},
            "getFrameworksByCategorieValue" : { method: "GET", isArray: true, url :url+'categorie/:categorie_label/frameworks'},

            //"getCategorieStructure" :  { method: "GET", isArray: false, url : url+'categorie_structure'}
            //"getFrameworks" : { method: "GET", isArray: false, url : url_api+'frameworks'}
            //"categorie" : { method: "GET", isArray: false, url: url+'categorie/:id'}
        }
    );

    var categorieServiceRest = $resource(url+'categorie_crud', null, {});

    var frameworkServiceRest = $resource(url+'framework_crud', null, {});

    var experienceServiceRest = $resource(url+'experience_crud', null, {
        post : {headers: {'Content-Type': 'text/plain'} }
    });

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
        getFrameworks : function(){
            return serviceRest.getFrameworks().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        getExperiences : function(){
            return serviceRest.getExperiences().$promise
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


            return categorieServiceRest.save(categorie).$promise
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


            return frameworkServiceRest.save(framework).$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        experience : function(experience){


            return experienceServiceRest.save(JSON.stringify(experience)).$promise
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