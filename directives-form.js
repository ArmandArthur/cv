angular.module("Directives", ["ngRoute"])
.controller('categorieFormulaireController', function($scope) {
      $scope.submit = function() { 

            $scope.$emit('categorieFormulaireSubmit', {
                categorie_nom: $scope.categorie.nom
            });
            

           
      };
})
.directive("formulaireCategorie", function() {
	return {
		restrict: "E",        
		templateUrl: 'formulaireCategorie.html',
        scope: {
            categorie : '='
        }
	}
})
.controller('frameworkFormulaireController', function($scope) {

      $scope.submit = function() { 
            var objet =  {
                categorie_id: $scope.framework.categorie.id,
                framework_id : $scope.framework.id,
                framework_nom : $scope.framework.nom,
                framework_version : $scope.framework.version,
                framework_level : $scope.framework.level,
            };

            $scope.$emit('frameworkFormulaireSubmit',objet);
      };

})
.directive("formulaireFramework", function() {
    return {
        restrict: "E",        
        templateUrl: 'formulaireFramework.html',
        controller: 'frameworkFormulaireController',
        scope: {
            framework : '=framework',
            categories : '=categories'
        }


    }
})
.controller('experienceFormulaireController', function($scope) {


     $scope.checkbox_selection = []; 

        $scope.remove = function(item) { 
              var index = $scope.checkbox_selection.indexOf(item);
              $scope.checkbox_selection.splice(index, 1);     
        };

        // Scope parent
        if($scope.experience != null)
        {
        for(var i = 0; i<$scope.experience.frameworks.length; i++){
           
                $scope.checkbox_selection.push($scope.experience.frameworks[i].id);    
            
            
            
          }
        }

      $scope.ngclick = function(framework_id){

                if($scope.checkbox_selection.indexOf(framework_id) > -1 )
                    $scope.remove(framework_id);    
                else
                    $scope.checkbox_selection.push(framework_id);   

            
            
      };
      $scope.submit = function() { 
            var objet =  {
                frameworks_checked: $scope.checkbox_selection,
                experience_titre : $scope.experience.titre,
                experience_id : $scope.experience.id
            };
           
            $scope.$emit('experienceFormulaireSubmit',objet);
            $scope.checkbox_selection = [];  // on remet à null

      };



})
.directive("formulaireExperience", function() {
    return {
        restrict: "E",        
        templateUrl: 'formulaireExperience.html',
        controller: 'experienceFormulaireController',
        scope: {
            frameworks : '=frameworks',
            experience : '=experience',

        }/*,
        link: function(scope, element, attr, parentDirectCtrl){
          xcope.$parent.$watch('experienceController', function(newValue, oldValue){
            if(newValue == true)
                scope.experienceFunction(scope);
            })
      };*/
        


    }
});


