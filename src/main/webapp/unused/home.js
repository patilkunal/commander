mycontrollers.HomeController = function($scope, $rootScope, $modal, TestStatisticService, genericErrorHandler, TestCaseService, TestExecutorService, TestResultService) {

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
	                  ["", 100]
	                  ];
	
	$scope.bardata = [[0], [0]];
	$scope.barcategories = ['Requesting data ...'];
	$scope.barseries = [{ "label" : "Success", "color" : "#46995D"}, { "label" : "Failed", "color" : "#CC3300"} ];
	
	$scope.recenttests = [];
	$scope.testrunhistory = [];

	$scope.getRunHistory = function() {
		TestCaseService.getTestCaseHistory(10).success(function(data, status){
			$scope.testrunhistory = data;
		}).error(function(data, status) { genericErrorHandler(data, status); });
	};
	
	$scope.getChartData = function() {
		TestStatisticService.getStatistics().success(function(data, status){
			if(angular.isArray(data)) {
				var success = [];
				var failures = [];
				$scope.barcategories = [];
				for(var i=0; i < data.length; i++) {
					$scope.barcategories.push(data[i].category);
					success.push(data[i].success);
					failures.push(data[i].failures);
					
					//populate pie data just for BATCH type values
					if("BATCH" == data[i].category) {
						$scope.piedata = [];
						$scope.piedata.push(["Success", data[i].success]);
						$scope.piedata.push(["Failures", data[i].failures]);
					}
				}
				//$scope.barcategories = categories;
				$scope.bardata = [];
				$scope.bardata.push(success); $scope.bardata.push(failures);
				
			} else {
				genericErrorHandler("Statistics by category call returned invalid data");
			}
		}).error(function(data, status) { genericErrorHandler(data, status); });
	};
	
	$scope.runThisTest = function (testid, hostid) {
		//get the test instance and then run the test 
		TestCaseService.getTestInstance(testid).success(function(data, status) {
			//TODO: how do we get which HOST did the test ran on???
			console.log("Running test for id " + testid);
			var testresults = [];
			
			var ti = data;
			testresults.push({id: ti.id, name: ti.name, result: 'Pending'});
			TestResultService.setTestResults(testresults);

			var modalinstance = $modal.open({
				templateUrl: 'testProgress.html',
				controller: 'TestProgressDialogController',
				size: 'lg', 
				keyboard: true,
				backdrop: 'static'
			});

			TestExecutorService.runTest(hostid, testid)
			   .success(function(data,status,header,config) {
					var respstring = data;
					if(angular.isObject(data)) {
						respstring = angular.toJson(data);
					}
					TestResultService.updateTestResult(respstring);			
				}).error(function(data, status, headers, config) {
					console.log(data);
					var respstring = data;
					if(angular.isObject(data)) {
						respstring = angular.toJson(data);
					}
					TestResultService.updateTestResult(respstring);
					//TestResultService.updateTestResult(data);
				});
			
			$scope.getChartData();
			$scope.getRunHistory();
			
		}).error(function(data, status) { genericErrorHandler(data); });
	};
	
	$scope.getTestInstanceById = function(id) {
		TestCaseService.getTestInstance(id);
	};

	$scope.getChartData();
	$scope.getRunHistory();
	
};
