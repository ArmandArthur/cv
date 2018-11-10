angular.module("preindexcv", [ "ngSanitize", "preindexDirectives", "DirectivesApiRestfulPreIndex","chart.js",])
.controller("preindexController", function($scope, $location, preindexRestfulService) {
			preindexRestfulService.getCategories().then(function(categories){

				$scope.data = [];
				$scope.labels = [];
				var dataset = [];

				$scope.options = {
				  scale: {
				    ticks: {
				      beginAtZero: true,
				      min: 0,
				      max: 100
				    },  
				  }
				};
		  		for(var i in categories)
	  			{	
	  				if(categories[i].value != null) // car sinon il y a la promise
	  				{
						$scope.labels.push(categories[i].value)	;		
						dataset.push(categories[i].level);
	  				}
	  			}
	  			$scope.data.push(dataset);

  					$scope.categories = categories;			  		

	  			
	  		});	
});


