angular.module("preindexcv", [ "ngSanitize", "preindexDirectives", "DirectivesApiRestfulPreIndex"])
.controller("preindexController", function($scope, $location, preindexRestfulService) {
	$scope.$on('inscriptionFormulaireSubmit', function(event, inscription) {
		//console.info($scope.get_categorie_structure());
       preindexRestfulService.inscription(inscription).then(function(framework){
	  		
	  		
	  	})

    });
});

