mycontrollers.BatchTestController = function($scope, $http) {
	
	var makeUrl = function(host, port, url) {
		return "http://" + host + ":" + port + (url.charAt(0) != '/' ? '/' : '') +  url ;
	};
	
	$scope.hostname = "10.8.172.139";
	$scope.port = "8080";
	$scope.url = "/batch/scheduledBatchJob/bsidImport";
	$scope.type = "GET";
	$scope.testresult = "";
	$scope.data = "";
	
	/*
	$scope.tests = [
	                new TestCase("BSID Import Job", "http://#HOSTNAME#:#PORT#/batch/bsidMappingImport/start/controllerId/:controllerId/userName/:userName", ""),
	                ];
	*/
	$scope.executeTest = function() {
		try {
			if("GET" == $scope.type) {
				var testurl = makeUrl($scope.hostname, $scope.port, $scope.url);
				alert("Connecting to " + testurl);
				var postdata = {
					host: $scope.hostname,
					port: $scope.port,
					url: $scope.url,
					method: $scope.type,
					data: $scope.data
				}; 
				$http.post('/executeTest', postdata).success(function(data) {
					$scope.testresult = data;
				}).error(function(err) {
					$scope.testresult = "Error in request";
				});
				
			}
		} catch(error) {
			$scope.testresult = "Error: " + error;
		}
	};
	
};

