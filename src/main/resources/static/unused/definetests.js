(function(){
	

/**
 * TestCase Object constructor 
 */
function TestCase() {
	this.id = -1;
	this.name = '';
	this.description = '';
	this.testCategoryId = 0;
	this.restUrl = '';
	this.data = '';
	this.method = 'GET';	
}

mycontrollers.TestInstanceController = function($scope, $location, $routeParams, TestCaseService, MessageService) {

	$scope.testCase = {};
	$scope.testInstanceForm = {};
	
	$scope.testCaseId = $routeParams.testcaseid;
	
	TestCaseService.getTestCase($scope.testCaseId).success(function(data){
		$scope.testCase = data;

		TestCaseService.createTestInstance($scope.testCaseId).success(function(data){
			$scope.testInstanceForm = data;
		}).error(function(data, status) {
			alert("Error creating test case instance : " + status);
		}); 
	});
	
	
	$scope.saveTestCaseInstance = function() {
		TestCaseService.saveTestInstance($scope.testInstanceForm).success(function(data) {
			MessageService.showSuccess("Successfully create test case instance");
			$location.url("/tests");
		}).error(function(data, status){
			MessageService.showError("Error saving test case instance " + status);
		});
	};
	
	$scope.cancelSave = function() {
		$location.url("/tests");
	};
	
};

mycontrollers.TestCaseDetailController = function($scope, $routeParams, $location, TestCaseService, MessageService) {
	$scope.methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
	$scope.testForm = {};
	$scope.categories = [];
	$scope.testCaseId = $routeParams.testcaseid;

	TestCaseService.getTestCategories().success(function(data){
		$scope.categories = data;
		$scope.selectedCategoryId = data[0].id;
		if($scope.testCaseId == "new") {
			$scope.testForm = new TestCase();
		} else {
			TestCaseService.getTestCase($scope.testCaseId).success(function(data){
				var testcase = data;
				if(testcase != null) {
					$scope.testForm.id = testcase.id;
					$scope.testForm.name = testcase.name;
					$scope.testForm.description = testcase.description;
					$scope.testForm.testCategoryId = testcase.testCategoryId;
					$scope.testForm.restUrl = testcase.restUrl;
					$scope.testForm.data = testcase.data;
					$scope.testForm.method = testcase.method;
				} 
			}).error(function(data) {
				MessageService.showError("Unable to load test case for edit : " + data);
			});
		}
	});
	
	$scope.saveTest = function() {
		TestCaseService.saveTestCase($scope.testForm).success(function(data){
			MessageService.showSuccess("Successfully saved test case");
			$location.url("/tests");
		}).error(function(data, status, headers, config){
			MessageService.showError("Error saving Testcase : " + status);
		});
		
	};
	
	$scope.cancelSave = function() {
		$location.url("/tests");
	};
	
};

mycontrollers.DefineTestController = function($scope, $location, TestCaseService, MessageService) {

	
	$scope.testcases = [];
	$scope.categories = [];
	$scope.selectedCategoryId = 0;
	
	TestCaseService.getTestCategories().success(function(data){
		$scope.categories = data;
		$scope.selectedCategoryId = data[0].id;
		TestCaseService.getTestCases($scope.selectedCategoryId).success(function(data){
			$scope.testcases = data;
		});
	});
	
	$scope.refresh = function() {
		TestCaseService.getTestCases($scope.selectedCategoryId).success(function(data){
			$scope.testcases = data;
		});		
	};
	
	$scope.createTestCase = function() {
		$location.url("/test/new");
	};
	
	$scope.getTestCase = function(id) {
		for(var i=0; i < $scope.testcases.length; i++) {
			if(id == $scope.testcases[i].id) {
				return $scope.testcases[i];
			}
		}
		return null;
	};
	
	$scope.deleteTestCase = function(id) {
		if(confirm("All existing instances will be deleted and you will not be able to run tests.\nDo you really want to delete test case?")) {
			TestCaseService.deleteTestCase(id).success(function(data){
				$scope.refresh();
			});
		}
	};

	$scope.editTestCase = function(id) {
		$location.url("/test/" + id);
	};
	
	
	
	$scope.addToList = function(testcase) {
		var found = false;
		var i=0;
		for(; i < $scope.testcases.length; i++) {
			if(testcase.id == $scope.testcases[i].id) {
				found = true;
				break;
			}
		}
		
		if(found) {
			//update existing
			$scope.testcases[i] = testcase;
		} else {
			$scope.testcases.push(testcase);
		}
	};
	
	$scope.createTestCaseInstance = function(testCaseId) {
		$location.url("/newinstance/" + testCaseId);
	};
	
};

})();
