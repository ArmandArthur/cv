var app = angular.module("cv", [ "ngSanitize", "Directives", "DirectivesApiRestful","ngAnimate","chart.js", "ngCookies"])
.controller("categorieController", function($scope, $location, restfulService, $cookies) {
	$scope.categories = [];
	$scope.frameworks = [];
	$scope.experiences = [];
	$scope.vueCourante = "HOME";
	$scope.frameworkCourant = null;
	$scope.experienceCourant = null;
	$scope.isConnectedByCookie = false;
	$scope.chart;
	$scope.categorieCourant = "PHP";
	$scope.crudCategorie = 1;
	$scope.crudCategorieMax = 0;



	/*$scope.remove_get_url = function(sourceURL){
	    var rtn = sourceURL.split("?")[0],
	        param,
	        params_arr = [],
	        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
	    if (queryString !== "") 
	    {
	        params_arr = queryString.split("&");
	        for (var i = params_arr.length - 1; i >= 0; i -= 1) 
	        {
	            param = params_arr[i].split("=")[0];
	            if (param === key) 
	            {
	                params_arr.splice(i, 1);
	            }
	        }
	        rtn = rtn + "?" + params_arr.join("&");
	    }
	    window.history.pushState('',document.title,rtn)
	}

	if(typeof $location.search().token != 'undefined')
	{
		$cookies.token = $location.search().token;
	}*/
	//$window.sessionStorage.setItem('token', $location.search().token);
	//$location.url($location.path());
	//$location.path($scope.vueCourante);
	//$scope.remove_get_url($location.path());



	$scope.display_categorie_formulaire = function() 
	{	
		//$scope.framework_selection(framework);
		$scope.vueCourante = 'FORMULAIRE_CATEGORIE';
		
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
		$scope.vueCourante = 'FORMULAIRE_FRAMEWORK';
		
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
		$scope.vueCourante = 'FORMULAIRE_EXPERIENCE';
		$location.path($scope.vueCourante); // url

			

	}

	$scope.$on('categorieFormulaireSubmit', function(event, categorie) {
       restfulService.categorie(categorie).then(function(response){
	  		$scope.crudCategorie =  response.nombre;
	  		$scope.vueCourante = "DISPLAY_CATEGORIES"; //template
	  		$scope.categories.push(response.categorie); // push nouvelle catégorie

	  		$location.path($scope.vueCourante); // url

	  	})
    });
    
	$scope.$on('frameworkFormulaireSubmit', function(event, framework) {
		//console.info($scope.get_categorie_structure());
       restfulService.framework(framework).then(function(framework){
	  		$scope.vueCourante = "DISPLAY_TECHNOS"; //template
	  		$scope.categorieCourant = framework.categorie.value;
	  		$location.path($scope.vueCourante+"/"+$scope.categorieCourant); // url
	  	})

    });
	$scope.$on('experienceFormulaireSubmit', function(event, experience) {
		//console.info($scope.get_categorie_structure());
       restfulService.experience(experience).then(function(experienceReturned){
	  		$scope.vueCourante = "DISPLAY_EXPERIENCES"; 
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

/*$scope.$on('$locationChangeStart', function(){
	alert('ok')
  $scope.sort = $location.search().sort;
  $scope.order = $location.search().order;
  $scope.offset = $location.search().offset;
});*/

	$scope.$watch(
		function() 
		{
			return $location.search();
		}, 
		function(location_search) 
		{
			var url = location_search.VUE;
			var categorie_value = location_search.CATEGORIE_VALUE;
			//var categorie_value = location.split('/')[3];

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

			if(url == 'FORMULAIRE_FRAMEWORK')
			{
				$scope.vueCourante = url;
			}	
			else if(url == 'FORMULAIRE_EXPERIENCE')
			{
				$scope.vueCourante = url;
				$scope.animateTechnologies = "technologies";
			}
			else if(url == 'DISPLAY_EXPERIENCES')
			{
				$scope.vueCourante = url;


			}	
			else if(url == 'DISPLAY_TECHNOS')
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
			else if(url == 'DISPLAY_CATEGORIES' || url == '#HOME')
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
				$scope.vueCourante = 'FORMULAIRE_CATEGORIE';
				$location.path($scope.vueCourante);
	
		});
  };
      $scope.onClickTechnos = function (e) {
      	var framework_nom = e[0]._model.label;

    	restfulService.getFrameworkByNom(framework_nom).then(function(framework){

				$scope.frameworkCourant = framework;
				$scope.vueCourante = 'FORMULAIRE_FRAMEWORK';
				$location.path($scope.vueCourante);
	
		});
  };

    /*$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
		restfulService.getUtilisateurByIp(data.geobytesipaddress).then(function(utilisateur){
			if( utilisateur.email )
			{
				$scope.isConnectedByCookie = true;
				$scope.vueCourante = 'HOME';
				$location.path($scope.vueCourante);
			}
		});
    });*/





	
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    console.info(document.cookie);
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

app.factory('myHttpResponseInterceptor',['$q','$location', function($q,$location){
  return {
    'request': function (config) {
                    config.headers = config.headers || {};
                    if (getCookie('token')) {
                        config.headers.Authorization = 'Bearer ' + getCookie('token');
                    }
                    return config;
                },

        'responseError': function (rejection) {
            if (rejection.status === 304)  return $q.resolve(rejection);

            return $q.reject(rejection);
        }
  }
}]);
//Http Intercpetor to check auth failures for xhr requests
app.config(['$httpProvider', '$locationProvider' ,function($httpProvider, $locationProvider) {
  //$locationProvider.html5Mode(true);
  $locationProvider.html5Mode(true).hashPrefix('*');
  $httpProvider.interceptors.push('myHttpResponseInterceptor');
}]);

