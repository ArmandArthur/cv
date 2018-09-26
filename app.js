angular.module("cv", [ "ngSanitize", "Directives", "DirectivesApiRestful" ])
.controller("categorieController", function($scope, $location, restfulService) {
	$scope.categories = [];
	$scope.frameworks = [];
	$scope.experiences = [];
	$scope.vueCourante = "VUE_DISPLAY_CATEGORIES";
	$scope.frameworkCourant = null;
	$scope.experienceCourant = null;
	$location.path($scope.vueCourante);


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
	$scope.display_experience_formulaire = function(experience) 
	{	
		$scope.experienceCourant = experience;
		$scope.vueCourante = 'VUE_FORMULAIRE_EXPERIENCE';
		$location.path($scope.vueCourante); // url

			

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
	$scope.$on('experienceFormulaireSubmit', function(event, experience) {
		//console.info($scope.get_categorie_structure());
       restfulService.experience(experience).then(function(experienceReturned){
	  		$scope.vueCourante = "VUE_DISPLAY_EXPERIENCES"; 
	  		//$scope.experiences.push(experienceReturned);
	  		$location.path($scope.vueCourante); 
	  	});

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


			restfulService.getFrameworks().then(function(frameworks){
		  		$scope.frameworks = frameworks;
		  		
		  	});

			restfulService.getExperiences().then(function(experiences){
		  		$scope.experiences = experiences;
		  		
		  	});
			restfulService.getCategories().then(function(categories){
		  		$scope.categories = categories;
		  	});

			if(url == 'VUE_FORMULAIRE_CATEGORIE')
			{
				$scope.vueCourante = url;
			}
			else if(url == 'VUE_FORMULAIRE_FRAMEWORK')
			{
				$scope.vueCourante = url;
			}	
			else if(url == 'VUE_FORMULAIRE_EXPERIENCE')
			{
				$scope.vueCourante = url;
			}
			else if(url == 'VUE_DISPLAY_EXPERIENCES')
			{
				$scope.vueCourante = url;

			}	
			else if(url == 'VUE_DISPLAY_CATEGORIES')
			{
				$scope.vueCourante = url;
			}			
			else if(url == 'VUE_DISPLAY_CATEGORIE')
			{
				$scope.vueCourante = url;

			}
			
		
		}
	);






	
});


