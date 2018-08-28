angular.module("cv", [ "ngSanitize", "Directives", "DirectivesApiRestful" ])
.controller("categorieController", function($scope, $location, restfulService) {
	$scope.categories = [];
	$scope.frameworks = [];
	$scope.vueCourante = "VUE_DISPLAY_CATEGORIES";
	$scope.frameworkCourant = null;



	$scope.display_categorie_formulaire = function() 
	{	
		//$scope.framework_selection(framework);
		$scope.vueCourante = 'VUE_FORMULAIRE_CATEGORIE';
		
	}

	$scope.display_framework_formulaire = function(framework) 
	{	
		//$scope.framework_selection(framework);
		$scope.frameworkCourant = framework;
		$scope.vueCourante = 'VUE_FORMULAIRE_FRAMEWORK';
		
		//$scope.framework = framework;
		//$location.path($scope.vueCourante); // url

		
	}

	$scope.$on('categorieFormulaireSubmit', function(event, categorie) {
		//console.info($scope.get_categorie_structure());
       restfulService.categorie(categorie).then(function(categorie){
	  		$scope.vueCourante = "VUE_DISPLAY_CATEGORIES"; //template
	  		$scope.categories.push(categorie); // push nouvelle catégorie
	  		$location.path($scope.vueCourante); // url
	  	})
    });
    
	$scope.$on('frameworkFormulaireSubmit', function(event, framework) {
		//console.info($scope.get_categorie_structure());
       restfulService.framework(framework).then(function(framework){
	  		$scope.vueCourante = "VUE_DISPLAY_CATEGORIE"; //template

	  		$location.path($scope.vueCourante+"/"+framework.categorie.value); // url
	  	})

    });

	$scope.$watch(
		function() 
		{
			return $location.path();
		}, 
		function(location) 
		{
			var url = location.split('/')[1];
			var categorie_value = location.split('/')[2];

			if(url == 'VUE_FORMULAIRE_CATEGORIE')
			{
				//alert('ko')
			}
			else if(url == 'VUE_FORMULAIRE_FRAMEWORK')
			{
				//alert('ko')
			}			
			else if(url == 'VUE_DISPLAY_CATEGORIES')
			{
				restfulService.getCategories().then(function(categories){
			  		$scope.categories = categories;
			  		$scope.vueCourante = url;
			  	});
			}			
			else if(url == 'VUE_DISPLAY_CATEGORIE')
			{
				restfulService.getCategories().then(function(categories){
			  		$scope.categories = categories;
			  		$scope.vueCourante = url;
			  	});

				restfulService.getFrameworksByCategorieValue(categorie_value).then(function(frameworks){
					$scope.frameworks = [];					
			  		angular.forEach(frameworks, function(framework, key) {
			  			$scope.frameworks.push(framework);
			  		});



			  		

			  	});

			}
			
		
		}
	);






	
});


