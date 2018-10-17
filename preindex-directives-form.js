angular.module("preindexDirectives", ["ngValidate", "vcRecaptcha"])
.controller('preindexLoginFormulaireController', function($scope) {
    $scope.validationLogin = {
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true
            }
        },
        messages: {
            email: {
                required: "Email requis",
            },
            password: {
                required: "Mot de passe  requis",
            }
        }
    }

      $scope.submit = function(form) {

            if(form.validate())
            {
              /*var objet =  {
                  categorie_id: $scope.framework.categorie.id,
                  framework_id : $scope.framework.id,
                  framework_nom : $scope.framework.nom,
                  framework_version : $scope.framework.version,
                  framework_level : $scope.framework.level,
              };

              $scope.$emit('frameworkFormulaireSubmit',objet);*/
            }


      };

})
.directive("formulaireLogin", function() {
    return {
        restrict: "E",        
        templateUrl: 'preindexLoginFormulaire.html',
        controller: 'preindexLoginFormulaireController',
        scope: {
        }


    }
})
.controller('preindexInscriptionFormulaireController', function($scope) {
    $scope.validationInscription = {
        rules: {
            email: {
                required: true,
            },
            password: {
                required: true
            }
        },
        messages: {
            email: {
                required: "Email requis",
            },
            password: {
                required: "Mot de passe  requis",
            }
        }
    }

      $scope.submit = function(form) {

            if(form.validate())
            {
              console.info($scope.recaptcha)
              /*var objet =  {
                  categorie_id: $scope.framework.categorie.id,
                  framework_id : $scope.framework.id,
                  framework_nom : $scope.framework.nom,
                  framework_version : $scope.framework.version,
                  framework_level : $scope.framework.level,
              };

              $scope.$emit('frameworkFormulaireSubmit',objet);*/
            }


      };

})
.directive("formulaireInscription", function() {
    return {
        restrict: "E",        
        templateUrl: 'preindexInscriptionFormulaire.html',
        controller: 'preindexInscriptionFormulaireController',
        scope: {
        }


    }
});




