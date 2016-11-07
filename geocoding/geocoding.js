var app = angular.module('geocoding', []);

app.controller('moviesCtrl', function($scope, $http, $sce) {
	
	$scope.locations = []; // Stores all the locations
	$scope.currentLocation = '';
	$scope.coordinates = [];
	$scope.coordsJson = '';
	$scope.index = 450;
	$scope.currentLat = '';
	$scope.currentLong = '';
	$scope.result = "";
	$scope.geocoder = new google.maps.Geocoder();
	
	$scope.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: new google.maps.LatLng(37.80, -122.33),
	});
	
	$scope.defaultPos = new google.maps.LatLng(37.794584, -122.385491);
	$scope.searchBounds = new google.maps.LatLngBounds(new google.maps.LatLng(37.810542, -122.533974), new google.maps.LatLng(37.712400, -122.342987))
	
	$scope.marker = new google.maps.Marker({
      map: $scope.map,
   	position: $scope.defaultPos,
   	draggable:true,
   });
	
	$http.get("https://data.sfgov.org/resource/wwmu-gmzc.json")
	.then(function(response) {
		var retrieved = response.data;
		retrieved.sort(function(a, b) {
			return [a.title, a.release_year].join().localeCompare([b.title, b.release_year].join());
		});
		
		//Merging same movies with several locations and associated fun facts
		var itMovies = 0;
		for (var i = 0; i< retrieved.length; i++) {
			var elem = retrieved[i];
			if(elem.locations != null){
				var locIdx = $scope.locations.indexOf(elem.locations);
				if (locIdx == -1) {
					$scope.locations.push(elem.locations);
				}
			}
		}
		
		// Saving the data for geocoding
		$scope.geocode(450);
		
	}, function(response) {
		console.log("Error loading data: " + response.statusText);
	});
	
	$scope.$watch('index', function(){
		if($scope.index >= $scope.locations.length && $scope.locations.length > 450){//done
			$scope.currentLocation = "Done!";
		} else {
			if($scope.index != 0){
				$scope.coordinates.push({'location': $scope.currentLocation, 'lat': $scope.marker.getPosition().lat(), 'lng': $scope.marker.getPosition().lng()});
				$scope.coordsJson = JSON.stringify($scope.coordinates);
			}
		
			$scope.geocode($scope.index);
		}
		
	});
	
	$scope.geocode = function(index){
		$scope.currentLocation = $scope.locations[$scope.index];
		$scope.geocoder.geocode({'address': $scope.currentLocation, 'componentRestrictions': {
    country: 'US',
    locality: 'San Francisco'
  }
}, function(results, status) {
          if (status === 'OK') {
            $scope.map.setCenter(results[0].geometry.location);
            $scope.marker.setPosition(results[0].geometry.location);
            $scope.currentLat = results[0].geometry.location.lat();
            $scope.currentLong = results[0].geometry.location.lng();
          } else {
            $scope.map.setCenter($scope.defaultPos);
            $scope.marker.setPosition($scope.defaultPos);
            $scope.currentLat = $scope.defaultPos.lat();
            $scope.currentLong = $scope.defaultPos.lng();
          }
				$scope.result = status;
	});
	};
    
});

