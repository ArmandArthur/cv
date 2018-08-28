angular.module("Directives", [])
.controller('categorieFormulaireController', function($scope) {
      $scope.submit = function() { 

            $scope.$emit('categorieFormulaireSubmit', {
                categorie_nom: $scope.categorie.nom
            });
            

           
      };
})
.directive("formulaireCategorie", function() {
	return {
		restrict: "E",        
		templateUrl: 'formulaireCategorie.html',
        scope: {
            categorie : '='
        }
	}
})
.controller('frameworkFormulaireController', function($scope) {

      $scope.submit = function() { 
            var objet =  {
                categorie_id: $scope.framework.categorie.id,
                framework_id : $scope.framework.id,
                framework_nom : $scope.framework.nom,
                framework_version : $scope.framework.version,
                framework_level : $scope.framework.level,
            };

            console.info(objet);
            $scope.$emit('frameworkFormulaireSubmit',objet);
      };
})
.directive("formulaireFramework", function() {
    return {
        restrict: "E",        
        templateUrl: 'formulaireFramework.html',
        controller: 'frameworkFormulaireController',
        scope: {
            framework : '=framework',
            categories : '=categories'
        }


    }
})

