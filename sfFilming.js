var app = angular.module('sfFilming', []);

app.controller('moviesCtrl', function($scope, $http) {
	$scope.sucessful = false;
	$scope.infoText = "Loading...";	
	$scope.selected = null;
	
    $http.get("https://data.sfgov.org/resource/wwmu-gmzc.json")
    .then(function(response) {
		var retrieved = response.data;
		$scope.movies = [];
		
		//Merging same movies with several locations and associated fun facts, assuming alphabetical order of titles
		for (var i = 0; i< retrieved.length; i++) {
			var elem = retrieved[i];
			if(i == 0 || elem.title != $scope.movies[$scope.movies.length -1].title){
				elem.locations = [elem.locations];
				elem.fun_facts = [elem.fun_facts];
				$scope.movies.push(elem);
			} else {
				$scope.movies[$scope.movies.length -1].locations.push(elem.locations);
				$scope.movies[$scope.movies.length -1].fun_facts.push(elem.fun_facts);
			}
		}
		
		
		    	
    	
        
        $scope.sucessful = true;
        $scope.infoText = "Sucess";
        $scope.selected = 0;
    }, function(response) {
        $scope.infoText = "Error loading data: " + response.statusText;
    });
    
    $scope.click = function(index){
    	if($scope.selected == index){
    		$scope.selected = null;
    	} else {
    		$scope.selected = index;
    	}
    }
});