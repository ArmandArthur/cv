angular.module("Directives", [])
.controller('competenceController', function($scope) {
      $scope.submit = function() {           
            console.info($scope.framework); 
            $scope.$emit('formulaireCompetenceSubmit', {
                competence: $scope.competence,
                id: $scope.framework.id,
                name: $scope.framework.name,
                version: $scope.framework.version,
                level: $scope.framework.level,
            });
            

           
      };
})
.directive("formulaireCompetence", function() {
	return {
		restrict: "E",        
		templateUrl: 'formulaireCompetence.html',
        scope: {
            framework: '=' 
        }
	}
})
