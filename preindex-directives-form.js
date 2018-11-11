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
              $(form).submit();
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
              /*var objet =  {
                  recaptcha: $scope.recaptcha,
                  email : $scope.email,
                  password : $scope.password
              };

              $scope.$emit('inscriptionFormulaireSubmit',objet);
              */
              $(form).submit();
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




