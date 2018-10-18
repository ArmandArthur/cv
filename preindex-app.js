angular.module("preindexcv", [ "ngSanitize", "preindexDirectives", "DirectivesApiRestfulPreIndex"])
.controller("preindexController", function($scope, $location, restfulService) {
	$scope.$on('inscriptionFormulaireSubmit', function(event, inscription) {
		//console.info($scope.get_categorie_structure());
       restfulService.inscription(inscription).then(function(framework){
	  		
	  		
	  	})

    });
});


