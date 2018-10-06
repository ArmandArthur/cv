angular.module("cv", [ "ngSanitize", "Directives", "DirectivesApiRestful","ngAnimate"])
.controller("categorieController", function($scope, $location, restfulService) {
	$scope.categories = [];
	$scope.frameworks = [];
	$scope.experiences = [];
	$scope.vueCourante = "VUE_HOME";
	$scope.frameworkCourant = null;
	$scope.experienceCourant = null;
	$scope.isConnectedByCookie = false;
	$location.path($scope.vueCourante);

	

	$scope.display_categorie_formulaire = function() 
	{	
		//$scope.framework_selection(framework);
		$scope.vueCourante = 'VUE_FORMULAIRE_CATEGORIE';
		
	}

	$scope.display_framework_formulaire = function(framework) 
	{	
		//$scope.framework_selection(framework);
		if(framework != null)
		{
			$scope.frameworkCourant = framework;
		}
		else{
			$scope.frameworkCourant =  {
 
                  categorie : {
                  		id : null
                  },
                  nom : null,
                  version: null,
                  level: null
              };
		}
		$scope.vueCourante = 'VUE_FORMULAIRE_FRAMEWORK';
		
		//$scope.framework = framework;
		//$location.path($scope.vueCourante); // url

		
	}
	$scope.display_experience_formulaire = function(experience) 
	{	
		if(experience != null)
		{
			$scope.experienceCourant = experience;
		}
		else{
			$scope.experienceCourant =  {
 
                  titre : null,
                  id : null,
                  date_debut: null,
                  date_fin: null,
                  type: null,
                  description: null,
                  frameworks : []
              };
		}
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
	  		$scope.vueCourante = "VUE_DISPLAY_CATEGORIES"; //template

	  		$location.path($scope.vueCourante); // url
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

	$scope.$on('utilisateurFormulaireSubmit', function(event, utilisateur) {
		//console.info($scope.get_categorie_structure());
       restfulService.utilisateur(utilisateur).then(function(utilisateurReturned){
       			if(utilisateurReturned.email != '')
   				{
   					$scope.isConnectedByCookie = true;
   				}
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

			console.info(url)


			if(typeof categorie_value != undefined)
			{
				restfulService.getFrameworks().then(function(frameworks){
			  		$scope.frameworks = frameworks;
			  		
			  	});

				restfulService.getExperiences().then(function(experiences){
			  		$scope.experiences = experiences;
			  		
			  	});
				restfulService.getCategories().then(function(categories){
			  		$scope.categories = categories;
			  	});	
			}
			else{
				restfulService.getCategories().then(function(categories){
			  		$scope.categories = categories;
			  		for(var i in $scope.categories)
		  			{	
		  				alert('o')
		  				if($scope.categories[i] == url)
	  					{
	  						alert('ok')
	  						$scope.categorie_selected = url;
	  					}
		  			}
			  	});	
			}
			if(url == 'VUE_FORMULAIRE_FRAMEWORK')
			{
				$scope.vueCourante = url;
			}	
			else if(url == 'VUE_FORMULAIRE_EXPERIENCE')
			{
				$scope.vueCourante = url;
				$scope.animateTechnologies = "technologies";
			}
			else if(url == 'VUE_DISPLAY_EXPERIENCES')
			{
				$scope.vueCourante = url;


			}	
			else if(url == 'VUE_DISPLAY_CATEGORIES')
			{

					$scope.vueCourante = url;
					$scope.animateTechnologies = "technologies";

			}			

			
		
		}
	);

    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
		restfulService.getUtilisateurByIp(data.geobytesipaddress).then(function(utilisateur){
			if( utilisateur.email )
			{
				$scope.isConnectedByCookie = true;
				$scope.vueCourante = 'VUE_DISPLAY_EXPERIENCES';
				$location.path($scope.vueCourante);
			}
		});
    });





	
});


