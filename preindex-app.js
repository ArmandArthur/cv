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

	  			$scope.height_chart = window.innerHeight*1
	  			$scope.width_chart = window.innerWidth*0.8
	  		});	


	  					preindexRestfulService.getFrameworks().then(function(frameworks){
		  		$scope.frameworks = frameworks;

				$scope.dataTechnos = [];
				$scope.labelsTechnos  = [];
				$scope.seriesTechnos = [];
				var dataset = [];

				$scope.optionsTechnos = {
				  scales: {
				    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Frameworks'
                            }
                        }],
                    yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                max: 100
                            }
                        }]
				  }
				};
		  		for(var i in frameworks)
	  			{	
	  				if(frameworks[i].nom != null) // car sinon il y a la promise
	  				{
	  					$scope.seriesTechnos.push(frameworks[i].nom)	;	
						$scope.labelsTechnos.push(frameworks[i].nom)	;		
						dataset.push(frameworks[i].level);
	  				}
	  			}
	  			$scope.dataTechnos.push(dataset);

	  			$scope.height_chart = window.innerHeight*1
	  			$scope.width_chart = window.innerWidth*0.8
		  	});
});


