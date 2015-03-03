mycontrollers.HomeController = function($scope, $rootScope) {

	/** Example to show JSON data parsing */
	$scope.jsondata = '{ "name" : "john", "age" : "20" }';
	
	$scope.objects = [];
		
	$scope.getJsonNameValue = function(jsondata) {
		$scope.objects = [];
		JSON.parse(jsondata, function(k,v) {
			if(k != "") {
				$scope.objects.push({'key': k, 'value': v});
			}
		});
		
	};
	/***** */
	
	
	$scope.opendialog = function() {
		$rootScope.openProgressDialog();
	};
	
	$scope.closedialog = function() {
		$rootScope.closeProgressDialog();
	};
	
	$scope.piedata = [
	                  ["Cats", 50],
	                  ["Dogs", 20],
	                  ["Bulls", 30]
	                  ];
	
	$scope.bardata = [[1,2,3,8], [5,3,2,1]];
	$scope.barcategories = ['Work 1', 'Work 2', 'Work 3', 'Work 4'];
	$scope.barseries = [{ "label" : "Success", "color" : "#46995D", "values": [1,2,3]}, { "label" : "Failed", "color" : "#CC3300", "values": [3,4,5]} ];
	
	$scope.recenttests = [];
	
	TestCaseService
	
};
