angular.module("DirectivesApiRestful", ["ngResource"])
.factory("restfulService", function($resource){

    var url = "http://armand-arthur.com:8085/api/"; 
    //var url = "http://arthur.cv-angular-node.com:8085/api/"
    var serviceRest  = $resource(
        url, 
        null, 
        {
            "getCategories" : { method: "GET", isArray: true, url: url+'categories'},
            "getFrameworks" : { method: "GET", isArray: true, url: url+'frameworks'},
            "getExperiences" : { method: "GET", isArray: true, url: url+'experiences'},
            "getCategorieByValue" : { method: "GET", isArray: false, url :url+'categorie/:categorie_value'},
            "getUtilisateurByIp" : { method: "GET", isArray: false, url :url+'utilisateur/:ip'},
            "getFrameworkByNom" : { method: "GET", isArray: false, url :url+'framework/:nom'},
             "getFrameworksByCategorieValue" : { method: "GET", isArray: true, url :url+'frameworks/categorie/:categorie_value'}
            //"getCategorieStructure" :  { method: "GET", isArray: false, url : url+'categorie_structure'}
            //"getFrameworks" : { method: "GET", isArray: false, url : url_api+'frameworks'}
            //"categorie" : { method: "GET", isArray: false, url: url+'categorie/:id'}
        }
    );

    var categorieServiceRest = $resource(url+'categorie_crud', null, {
    });
    var frameworkServiceRest = $resource(url+'framework_crud', null, {                
    });
    var experienceServiceRest = $resource(url+'experience_crud', null, {                
    });

    var serviceRequeteRest  = $resource(
        url, 
        null, 
        {
            "getCategorieRequest" : { method: "GET", isArray: false, url: url+'categorie_request'},
            "getFrameworkRequest" : { method: "GET", isArray: false, url: url+'framework_request'},
            "getExperienceRequest" : { method: "GET", isArray: false, url: url+'experience_request'}
        }
    );

    return {
        getCategorieRequest : function(){
            return serviceRequeteRest.getCategorieRequest().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        getFrameworkRequest : function(){
            return serviceRequeteRest.getFrameworkRequest().$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },
        getExperienceRequest : function(){
            return serviceRequeteRest.getExperienceRequest().$promise
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
        getCategorieByValue : function(value){


            return serviceRest.getCategorieByValue({categorie_value: value}).$promise
            .then(
                function(data) {
                    return data;
                },
                function() {
                    return 'error';
                } 
            );
        },        
        getFrameworkByNom: function(nom){
            return serviceRest.getFrameworkByNom({nom: nom}).$promise
            .then(
                function(data) {
                    return data;
                },
                function(error) {
                    console.info(error);
                    return 'error';
                } 
            );
        },
        getFrameworksByCategorieValue: function(categorie_value){
            return serviceRest.getFrameworksByCategorieValue({categorie_value: categorie_value}).$promise
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
        },
        getUtilisateurByIp: function(ip){
            return serviceRest.getUtilisateurByIp({ip: ip}).$promise
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
    }
});