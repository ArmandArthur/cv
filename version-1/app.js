angular.module("CV", [ "ngSanitize", "Directives" ])
.controller("CompetenceCtrl", function($scope, $location) {
	
	$scope.competences = [
		{ 
			value: "FRAMEWORK_PHP", 
			label: 'Framework PHP', 
			frameworks: [
				{ id: 1, name: "Phalcon", version: "1.2", level: "50"},
				{ id: 2, name: "Symfony", version: "3.3", level: "50"}
			]  
		}, 
		{ 
			value: "FRAMEWORK_JAVASCRIPT", 
			label: "Framework Javascript", 
			frameworks: [
				{ id: 3, name: "jQuery", version: "1.3", level: "100"},
				{ id: 4, name: "jQuery UI", version: "1.4", level: "70"},
				{ id: 5, name: "Fullcalendar", version: "1.5", level: "70"},
				{ id: 6, name: "AngularJs", version: "1.2.29", level: "20"},
				{ id: 7, name: "NodeJs", version: "6", level: "20"}
			]  
		},
	];

	$scope.vues = [
		{ value : "VUE_COMPETENCE_FORMULAIRE", label:"Formulaire compétence" },
		{ value : "VUE_COMPETENCE_LISTE", label:"Liste des compétences" }
	];
	

	$scope.competenceCourante = "FRAMEWORK_PHP";
	$scope.idCourant = 8;
	$scope.idDernier = null;	
	$scope.vueCourante = 'VUE_COMPETENCE_LISTE';
	$scope.frameworkCourant = null;

	$scope.competence_selection = function(competence) 
	{
		$scope.competenceCourante = competence;
	};
	$scope.vue_selection = function(vue) 
	{
		$scope.vueCourante = vue;
	};
	$scope.framework_selection = function(framework) 
	{
		$scope.frameworkCourant = framework;
	}

	$scope.display_competence_formulaire = function(framework) 
	{	
		$scope.framework_selection(framework);
		$scope.vueCourante = 'VUE_COMPETENCE_FORMULAIRE';
		//$location.path($scope.vueCourante);
		
	}

	$scope.$on('formulaireCompetenceSubmit', function(event, objet) {
        $scope.ajouter_competence(objet);
    });

    $scope.ajouter_competence = function(objet){
    	var update = false;

    	angular.forEach($scope.competences, function(competence, key) {

    		if(competence.value == objet.competence)
			{
				for( i = 0 ; i < competence.frameworks.length; i ++)
				{
					if(competence.frameworks[i].id == objet.id)
					{
						$scope.competences[key].frameworks[i].name = objet.name;
						$scope.competences[key].frameworks[i].version = objet.version;
						$scope.competences[key].frameworks[i].level = objet.level;
						update = true;

					}
				}
				$location.path(competence.value);

			}
			else
			{


				for( i = 0 ; i < competence.frameworks.length; i ++)
				{

					console.info(objet);
					if(competence.frameworks[i].id == objet.id  )
					{

		
							$scope.competences[key].frameworks.splice(i, 1);

					}

				}



			}





			
		});

		if(!update)
		{

    	angular.forEach($scope.competences, function(competence, key) {
    		if(competence.value == objet.competence){
				$scope.idDernier = objet.id + 1;

				$scope.competences[key].frameworks.push({
					id : $scope.idDernier,
					name : objet.name,
					version : objet.version,
					level  : objet.level
				});		

				$location.path(competence.value);
    		}
			
		});

							
		}



			// selectionner la compétence dans l'onglet
			

		$scope.vueCourante = 'VUE_COMPETENCE_LISTE';

		// Vide le formulaire de compétence
		$scope.frameworkCourant = null; 


    };




	$scope.$watch(
		function() 
		{
			return $location.path();
		}, 
		function(location) 
		{
			var url = location.split('/')[1];
			$scope.competences.forEach(function(competence) {
			if (competence.value == url) {
				$scope.competenceCourante = url; 
				return;
			}
			});

			$scope.vues.forEach(function(vue) {
			if (vue.value == url) {
				$scope.vueCourante = url; 
				return;
			}					
			});
		
		}
	);

	$scope.$watch(
		function() 
		{
			return $scope.vueCourante
		}, 
		function(vueCourante) 
		{

				$scope.vues.forEach(function(vue) {
					///alert(vueCourante);
					if (vue.value == vueCourante) {
						$scope.vue_selection(vueCourante);
						
					}
				});				
			
		}
	);

	$scope.$watch(
	function() 
	{
		return $scope.competenceCourante
	}, 
	function(competenceCourante) 
	{

			for(var i = 0 ; i< $scope.competences.length ; i++)
			{
				if ($scope.competences[i].value == competenceCourante) {

					$scope.competence_selection(competenceCourante);
					//$location.path(competenceCourante);
					return;
				}	
			}




	});





	
});
