/**
 * 
 */

myservices.TestResultService = function($rootScope) {
	var service = {};
	
	service.testresults = [];
	
	service.clearTestResults = function() {
		this.testresults = [];
	};
	
	service.setTestResults = function(results) {
		this.testresults = results;
	};
	
	service.updateTestResult = function(data) {
		console.log(data);
		var obj = angular.fromJson(data);
		for(var i=0; i < this.testresults.length; i++) {
			console.log(" id " + this.testresults[i].id + " : " + obj.testInstanceId);
			if(this.testresults[i].id == obj.testInstanceId) {
				console.log("setting value");
				if(obj.success) {
					this.testresults[i].result = obj.result;
				} else {
					this.testresults[i].result = obj.error;
				}
				this.broadcastItem();
			}
		}
	};
	
	service.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
	
	
	return service;
};

mycontrollers.RunTestController = function($scope, $modal, TestCaseService, HostService, TestExecutorService, TestResultService) {
	
	$scope.errormessage = null;
	$scope.infomessage = null;
	
	$scope.showlist = true;
	$scope.showtestinstanceform = false;
	
	$scope.selectedTests = [];
	
	//$scope.tests = [];
	
	$scope.toggleSelection = function(id) {
		var idx = $scope.selectedTests.indexOf(id);

	    // is currently selected
	    if (idx > -1) {
	      $scope.selectedTests.splice(idx, 1);
	    } else {
	      $scope.selectedTests.push(id);
	    }
	};
	
	$scope.runThisTest = function (testid) {
		console.log("Running test for id " + testid);
		var testresults = [];
		
		var ti = $scope.getTestInstanceById(testid);
		testresults.push({id: ti.id, name: ti.name, result: 'Pending'});
		TestResultService.setTestResults(testresults);

		var modalinstance = $modal.open({
			templateUrl: 'testProgress.html',
			controller: 'TestProgressDialogController',
			size: 'lg', 
			keyboard: true,
			backdrop: 'static'
		});

		TestExecutorService.runTest($scope.selectedHost.id, testid)
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
	};
	
	$scope.runSelectedTests = function() {
		
		var testresults = [];
		for(var i=0; i < $scope.selectedTests.length; i++) {
			var ti = $scope.getTestInstanceById($scope.selectedTests[i]);
			testresults.push({id: ti.id, name: ti.name, result: 'Pending'});
		}
		TestResultService.setTestResults(testresults);

		var modalinstance = $modal.open({
			templateUrl: 'testProgress.html',
			controller: 'TestProgressDialogController',
			size: 'lg', 
			keyboard: true,
			backdrop: 'static'
		});
		
		for(var i=0; i < $scope.selectedTests.length; i++) {
			var ti_id = $scope.selectedTests[i];
			TestExecutorService.runTest($scope.selectedHost.id, ti_id)
			.success(function(data, status, headers, config) {
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
		}
		
		$scope.selectedTests = [];
	};
	
	
	$scope.showList = function() {
		$scope.showlist = true;
		$scope.showtestinstanceform = false;		
	};
	
	$scope.showTestInstanceForm = function() {
		$scope.showlist = false;
		$scope.showtestinstanceform = true;		
	};
	
	$scope.categories = [],
	$scope.selectedCategoryId = 0,
	$scope.hosts = [];
	$scope.selectedHostId = 0;
	
	$scope.testInstanceForm = {};
	$scope.testForm = {};
	
	$scope.selectedHost = {hostname: '', port: ''};
	$scope.testcaseinstances = [];
	
	TestCaseService.getTestCategories().success(function(data, status, headers) {
		$scope.categories = data;
		$scope.selectedCategoryId = $scope.categories[0].id; 
		TestCaseService.getTestInstances($scope.selectedCategoryId).success(function(data, status, headers) {
			$scope.testcaseinstances = data;
		});

		HostService.getHostsByCategory($scope.selectedCategoryId).success(function(data2, status, headers) {
			$scope.hosts = data2;
			if($scope.hosts.length > 0) {
				$scope.selectedHost = $scope.hosts[0];
				$scope.selectedHostId = $scope.selectedHost.id;
			}
		});
	});
	
	
	
	//$scope.$watchCollection('selectedHost', function(newval, oldval) {  });

	$scope.refresh = function() {
		var modalInstance = $modal.open({
			templateUrl: 'progressModal.html',
			controller: 'ProgressDialogController',
			size: 'sm', 
			keyboard: false,
			backdrop: 'static',
			resolve: {
				message: function() {
					return "Refreshing Test Case Instances list";
				}
			}
		});			

		HostService.getHostsByCategory($scope.selectedCategoryId).success(function(data2, status, headers) {
			$scope.hosts = data2;
			if($scope.hosts.length > 0) {
				$scope.selectedHost = $scope.hosts[0];
				$scope.selectedHostId = $scope.selectedHost.id;
			}
		});

		TestCaseService.getTestInstances($scope.selectedCategoryId).success(function(data, status, headers) {
			$scope.testcaseinstances = data;
			modalInstance.close();
		}).error(function(data, status, headers) {
			modalInstance.close();
			$scope.errormessage = "Error in refreshing list : " + data;
		});
	};
	
	$scope.handleHostChange = function() {
		for(var i=0; i < $scope.hosts.length; i++) {
			if($scope.selectedHostId == $scope.hosts[i].id) {
				$scope.selectedHost = $scope.hosts[i];
				break;
			}
		}
	};
	
	$scope.getTestInstanceById = function(id) {
		for(var i=0; i < $scope.testcaseinstances.length; i++) {
			if($scope.testcaseinstances[i].id == id) 
				return $scope.testcaseinstances[i];
		}
	};
	
	$scope.getHostById = function(id) {
		var hostlist = $scope.hosts;
		for(var i=0; i < hostlist.length; i++) {
			if(hostlist[i].id == id) {
				return hostlist[i];
			}
		}
		return null;
	};
	
	//Not Used, now that we run tests in batch
	$scope.runTestInstance = function(id) {
		var testCaseInstance = $scope.getTestInstanceById(id);
		if(testCaseInstance != null) {
			$scope.errormessage = null;
			$scope.infomessage = null;
			var progressMessage = "Running Test : " + testCaseInstance.name;
			var modalInstance = $modal.open({
				templateUrl: 'progressModal.html',
				controller: 'ProgressDialogController',
				size: 'sm', 
				keyboard: false,
				backdrop: 'static',
				resolve: {
					message: function() {
						return progressMessage;
					}
				}
			});			
			
			TestExecutorService.runTest($scope.selectedHost.id, id)			
			.success(function(data, status, headers, config) {
				modalInstance.close(); 				
				var respstring = data;
				if(angular.isObject(data)) {
					respstring = angular.toJson(data);
				}
				$scope.infomessage = "Test Result : " + respstring;
			}).error(function(data, status, headers, config){
				modalInstance.close();
				$scope.errormessage = "Error in executing test : " + status + " : " + data;
			});
		} else {
			$scope.errormessage = "Unable to find Test Case Instance by id " + id;
		}
		
	};
	
	$scope.editAndRun = function(id) {
		var testCaseInstance = $scope.getTestInstanceById(id);
		if(testCaseInstance != null) {
			TestCaseService.getTestCase(testCaseInstance.testCaseId).success(function(data){
				var testcase = data;
			
				//We need resturl, httpmethod which is defined on testcase level
				var url = testcase.restUrl;
				var method = testcase.method;
				
				//The data is defined on test case instance level				
				var testdata = testcase.data;
				
				//Just for debug purpose
				/*
				var host = $scope.selectedHost.hostname;
				var port = $scope.selectedHost.port;
				alert(host + " " + port + " " + url + " " + data + " " + method);
				*/
				   
				TestExecutorService.runEditedTest($scope.selectedHost.id, url, method, testdata).success(function(respdata){
					alert("Response: " + respdata);
				}).error(function(data, status) {
					alert("Error in executing test");
				});
			});
		} else {
			alert("Unable to find Test Case Instance by id " + id);
		}		
	};
	
	$scope.editTestInstance = function(id) {
		var testCaseInstance = $scope.getTestInstanceById(id);
		if(testCaseInstance != null) {
			$scope.testInstanceForm.id = testCaseInstance.id;
	 		$scope.testInstanceForm.name = testCaseInstance.name;
	 		$scope.testInstanceForm.description = testCaseInstance.description;
	 		$scope.testInstanceForm.testCaseId = testCaseInstance.testCaseId;
	 		if((testCaseInstance.testCaseValues != null) && (testCaseInstance.testCaseValues.length > 0)) {
	 			$scope.testInstanceForm.testCaseValues = [];
	 			for ( var i=0; i < testCaseInstance.testCaseValues.length; i++ ) {
	 				var tcv = testCaseInstance.testCaseValues[i];
	 				$scope.testInstanceForm.testCaseValues.push({
	 					id: tcv.id,
	 					name: tcv.name,
	 					required: tcv.required,
	 					value: tcv.value
	 				});
				}
	 		}
	 		TestCaseService.getTestCase($scope.testInstanceForm.testCaseId).success(function(data){
	 			$scope.testForm = data;
				$scope.showTestInstanceForm();
	 		}).error(function(){
	 			$scope.testForm.name = "[Error getting Test Case]";
				$scope.showTestInstanceForm();
	 		});
		} else {
			alert("Unable to find test case instance to edit");
		}
	};
	
	$scope.cancelEditInstance = function() {
		$scope.showList();
	};
	
	$scope.saveTestCaseInstance = function() {
		TestCaseService.saveTestInstance($scope.testInstanceForm).success(function(data){
			$scope.addToList(data);
			$scope.showList();
			$scope.infomessage = "Successfully saved test case instance";
		}).error(function(data, status, headers, config) {
			$scope.errormessage = "Error saving test case instance";
		});
	};
	
	$scope.addToList = function(testcaseinstance) {
		var found = false;
		var i=0;
		for(; i < $scope.testcaseinstances.length; i++) {
			if(testcaseinstance.id == $scope.testcaseinstances[i].id) {
				found = true;
				break;
			}
		}
		
		if(found) {
			//update existing
			$scope.testcaseinstances[i] = testcaseinstance;
		} else {
			$scope.testcaseinstances.push(testcaseinstance);
		}
	};
	
	$scope.deleteTestInstance = function(id) {
		if(confirm("Do you really want to delete this test instance?")) {
			TestCaseService.deleteTestInstance(id).then(function(){
				$scope.infomessage = "Successfully deleted test case instance";
				$scope.refresh();
			});
		}
	};
	
	$scope.getCurlForTestInstance = function(id) {
		//then returns data in format {data:'', status:200, config: {method:'', transformRequest:[], transformResponse: [], url:'', headers:{}}, , statusText:'OK'} 
		TestCaseService.getCurl(id, $scope.selectedHostId).then(function(resp){
			$scope.infomessage = resp.data;			
		});
	};
};