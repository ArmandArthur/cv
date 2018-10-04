angular.module("Directives", ["ngValidate"])
.controller('categorieFormulaireController', function($scope) {
      $scope.submit = function() { 

            $scope.$emit('categorieFormulaireSubmit', {
                categorie_nom: $scope.categorie.nom.toUpperCase()
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
    $scope.validationFramework = {
       ignore:'',
        rules: {
            categorie: {
                required: true,
            },
            nom: {
                required: true
            },
            version: {
                required: true
            },
            level: {
                required: true
            }
        },
        messages: {
            categorie: {
                required: "Catégorie requise",
            },
            nom: {
                required: "Nom requis",
            },
            version: {
                required: "Version requis",
            },
            level: {
                required: "Level requis",
            }
        }
    }

      $scope.submit = function(form) {

            if(form.validate())
            {
              var objet =  {
                  categorie_id: $scope.framework.categorie.id,
                  framework_id : $scope.framework.id,
                  framework_nom : $scope.framework.nom,
                  framework_version : $scope.framework.version,
                  framework_level : $scope.framework.level,
              };

              $scope.$emit('frameworkFormulaireSubmit',objet);
            }


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


      if($scope.experience.date_debut){
           $scope.experience.date_debut = $scope.experience.date_debut.split('-')[2].replace('T00:00:00.000Z', '')+'/'+$scope.experience.date_debut.split('-')[1]+'/'+$scope.experience.date_debut.split('-')[0];
      }
      if($scope.experience.date_fin){
           $scope.experience.date_fin = $scope.experience.date_fin.split('-')[2].replace('T00:00:00.000Z', '')+'/'+$scope.experience.date_fin.split('-')[1]+'/'+$scope.experience.date_fin.split('-')[0];
      }

     $scope.checkbox_selection = [];
    $scope.validationExperience = {
       ignore:'',
        rules: {
            titre: {
                required: true,
                minlength: 3
            },
            datedebut: {
                required: true
            },
            datefin: {
                required: true
            },
            frameworks: {
                required: true
            },
            type: {
                required: true
            },
            description: {
                required: true
            }
        },
        messages: {
            titre: {
                required: "Titre requis",
            },
            datedebut: {
                required: "Date de début requise",
            },
            datefin: {
                required: "Date de fin requise",
            },
            frameworks: {
                required: "Frameworks requis",
            },
            type: {
                required: "Type requis",
            },
            description: {
                required: "Description requise"
            }
        }
    }

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
      $scope.submit = function(form) { 

            if(form.validate())
            {
              var objet =  {
                  frameworks_checked: $scope.checkbox_selection,
                  experience_titre : $scope.experience.titre,
                  experience_id : $scope.experience.id,
                  date_debut: $scope.experience.date_debut.split('/')[2]+'-'+$scope.experience.date_debut.split('/')[1]+'-'+$scope.experience.date_debut.split('/')[0].replace('T00:00:00.000', ''),
                  date_fin: $scope.experience.date_fin.split('/')[2]+'-'+$scope.experience.date_fin.split('/')[1]+'-'+$scope.experience.date_fin.split('/')[0].replace('T00:00:00.000', ''),
                  description: $scope.experience.description,
                  type: $scope.experience.type
              };
             console.info(objet);
              $scope.$emit('experienceFormulaireSubmit',objet);
              $scope.checkbox_selection = [];  // on remet à null
            }


      };
        var options = {  year: 'numeric', month: 'numeric', day: 'numeric' };
         $('input[name="datedebut"]').datetimepicker({
            format: 'DD/MM/YYYY'
        }).on('dp.change', function (e) { 
          var datedebut = e.date._d;
          $scope.experience.date_debut = datedebut.toLocaleDateString("fr-FR",options)
         });

                 $('input[name="datefin"]').datetimepicker({
            format: 'DD/MM/YYYY'
        }).on('dp.change', function (e) { 
          var datefin = e.date._d;

          $scope.experience.date_fin = datefin.toLocaleDateString("fr-FR",options)
         });




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
}).directive("formulaireUtilisateur", function() {
    return {
        restrict: "E",        
        templateUrl: 'formulaireUtilisateur.html',
        controller: 'utilisateurFormulaireController',
        scope: {

        }/*,
        link: function(scope, element, attr, parentDirectCtrl){
          xcope.$parent.$watch('experienceController', function(newValue, oldValue){
            if(newValue == true)
                scope.experienceFunction(scope);
            })
      };*/
        


    }
}).controller('utilisateurFormulaireController',['$scope', 
                       function($scope) {
 
      $scope.submit = function() { 
//$cookieStore.put('cookies',  $cookies );
            $scope.ip = null;
            $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
                  var utilisateur =  {
                      email: $scope.email,
                      ip: data.geobytesipaddress
                  };
                  $scope.$emit('utilisateurFormulaireSubmit',utilisateur);
                });



      };

      /*$scope.setCookie = function (name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};
  $scope.getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};*/


}]);


