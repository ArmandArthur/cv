var app = angular.module("cv", [ "ngSanitize", "Directives", "DirectivesApiRestful","ngAnimate","chart.js"])
.controller("categorieController", function($scope, $location, restfulService) {
	$scope.categories = [];
	$scope.frameworks = [];
	$scope.experiences = [];
	$scope.vueCourante = "VUE_HOME";
	$scope.frameworkCourant = null;
	$scope.experienceCourant = null;
	$scope.isConnectedByCookie = false;
	$scope.chart;
	$scope.categorieCourant = "PHP";
	$scope.crudCategorie = 1;
	$scope.crudCategorieMax = 0;
		
	
	localStorage.setItem('token', $location.search().token);
	$location.path($scope.vueCourante);
	$location.url($location.path());

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
       restfulService.categorie(categorie).then(function(response){
	  		$scope.crudCategorie =  response.nombre;
	  		$scope.vueCourante = "VUE_DISPLAY_CATEGORIES"; //template
	  		$scope.categories.push(response.categorie); // push nouvelle catégorie

	  		$location.path($scope.vueCourante); // url

	  	})
    });
    
	$scope.$on('frameworkFormulaireSubmit', function(event, framework) {
		//console.info($scope.get_categorie_structure());
       restfulService.framework(framework).then(function(framework){
	  		$scope.vueCourante = "VUE_DISPLAY_TECHNOS"; //template
	  		$scope.categorieCourant = framework.categorie.value;
	  		$location.path($scope.vueCourante+"/"+$scope.categorieCourant); // url
	  	})

    });
	$scope.$on('experienceFormulaireSubmit', function(event, experience) {
		//console.info($scope.get_categorie_structure());
       restfulService.experience(experience).then(function(experienceReturned){
	  		$scope.vueCourante = "VUE_DISPLAY_EXPERIENCES"; 
	  		//$scope.experiences.push(experienceReturned);
	  	    $scope.experienceCourant = experienceReturned;
	  		$location.path($scope.vueCourante); 
	  		setTimeout(function() {
    			$('html, body').animate({scrollTop: $('#experience-'+experienceReturned.id).offset().top - 75 }, 1000);
			}, 3000);
	  		
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

			restfulService.getFrameworks().then(function(frameworks){
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

		  	});

			restfulService.getExperiences().then(function(experiences){
		  		$scope.experiences = experiences;
		  		
		  	});

			restfulService.getCategories().then(function(categories){

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
		
			restfulService.getCategorieRequest().then(function(requete){
	  			$scope.crudCategorieMax = requete.max_limit;
	  		});	

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
			else if(url == 'VUE_DISPLAY_TECHNOS')
			{
				$scope.vueCourante = url;
				if(categorie_value == null)
				{
					categorie_value = $scope.categorieCourant;

				}
    	restfulService.getFrameworksByCategorieValue(categorie_value).then(function(frameworks){

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
	  					//$scope.seriesTechnos.push(frameworks[i].nom)	;	
						$scope.labelsTechnos.push(frameworks[i].nom)	;		
						dataset.push(frameworks[i].level);
	  				}
	  			}
	  			$scope.dataTechnos.push(dataset);
	
		});					
			

			}				
			else if(url == 'VUE_DISPLAY_CATEGORIES' || url == 'VUE_HOME')
			{

					$scope.vueCourante = url;
					$scope.animateTechnologies = "technologies";




			}			

			
		
		}
	);


		/*$scope.$on('chart-create', function (event, chart) {
		$scope.chart = chart;
	});*/
	$scope.setCategorie = function(categorie){
		$scope.categorieCourant = categorie.value;
	};
    $scope.onClick = function (e) {
    	
    	var index = e[0]._index;
    	$scope.frameworkCourantLabel = $scope.labels[index];
    	restfulService.getCategorieByValue($scope.frameworkCourantLabel).then(function(categorie){

				$scope.categorieCourant = categorie;
				$scope.vueCourante = 'VUE_FORMULAIRE_CATEGORIE';
				$location.path($scope.vueCourante);
	
		});
  };
      $scope.onClickTechnos = function (e) {
      	var framework_nom = e[0]._model.label;

    	restfulService.getFrameworkByNom(framework_nom).then(function(framework){

				$scope.frameworkCourant = framework;
				$scope.vueCourante = 'VUE_FORMULAIRE_FRAMEWORK';
				$location.path($scope.vueCourante);
	
		});
  };

    /*$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
		restfulService.getUtilisateurByIp(data.geobytesipaddress).then(function(utilisateur){
			if( utilisateur.email )
			{
				$scope.isConnectedByCookie = true;
				$scope.vueCourante = 'VUE_HOME';
				$location.path($scope.vueCourante);
			}
		});
    });*/





	
});

app.factory('myHttpResponseInterceptor',['$q','$location', function($q,$location){
  return {
    'request': function (config) {
                    config.headers = config.headers || {};
                    if (localStorage.getItem('token')) {
                        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
                    }
                    return config;
                }
  }
}]);
//Http Intercpetor to check auth failures for xhr requests
app.config(['$httpProvider',function($httpProvider) {
  $httpProvider.interceptors.push('myHttpResponseInterceptor');
}]);

