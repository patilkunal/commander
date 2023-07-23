/**
 * 
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

/*
function TestCase(id, name, description, testCategoryId, restUrl, data, method) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.testCategoryId = testCategoryId;
	this.restUrl = restUrl;
	this.data = data;
	this.method = method;
}
*/
function TestCaseInstance(id, name, description, testCaseId) {
	this.id = id;
	this.name = name;
	this.description = description;
	this.testCaseId = testCaseId;
}


mycontrollers.DefineTestController = function($scope, TestCaseService) {
	$scope.showlist = true;
	$scope.showtestform = false;
	$scope.showtestinstanceform = false;

	$scope.errormessage = null;
	$scope.infomessage = null;
	
	$scope.showListing = function() {
		$scope.showlist = true;
		$scope.showtestform = false;
		$scope.showtestinstanceform = false;		
	};
	
	$scope.showTestForm = function() {
		$scope.showlist = false;
		$scope.showtestform = true;
		$scope.showtestinstanceform = false;		
	};
	
	$scope.showTestInstanceForm = function() {
		$scope.showlist = false;
		$scope.showtestform = false;
		$scope.showtestinstanceform = true;		
	};
	
	$scope.methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
	
	$scope.testForm = {};
	$scope.testInstanceForm = {};
	
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
		$scope.testForm = new TestCase();
		$scope.showTestForm();
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
		var testcase = $scope.getTestCase(id);
		if(testcase != null) {
			
			$scope.testForm.id = testcase.id;
			$scope.testForm.name = testcase.name;
			$scope.testForm.description = testcase.description;
			$scope.testForm.testCategoryId = testcase.testCategoryId;
			$scope.testForm.restUrl = testcase.restUrl;
			$scope.testForm.data = testcase.data;
			$scope.testForm.method = testcase.method;
				
			$scope.showTestForm();
		} 
	};
	
	$scope.saveTest = function() {
		TestCaseService.saveTestCase($scope.testForm).success(function(data){			
			$scope.addToList(data);
			$scope.showListing();
		}).error(function(data, status, headers, config){
			$scope.errormessage = "Error saving Testcase : " + status;
		});
		
	};
	
	$scope.cancelSave = function() {
		$scope.testForm = {};
		$scope.testInstanceForm = {};
		$scope.showListing();
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
		$scope.testForm = $scope.getTestCase(testCaseId);
		TestCaseService.createTestInstance(testCaseId).success(function(data){
			$scope.testInstanceForm = data;
			$scope.showTestInstanceForm();
		}).error(function(data, status) {
			alert("Error creating test case instance : " + status);
		}); 
		
	};
	
	$scope.saveTestCaseInstance = function() {
		TestCaseService.saveTestInstance($scope.testInstanceForm).success(function(data) {
			$scope.showListing();
		}).error(function(data, status){
			alert("Error saving test case instance " + status);
		});
	};
};

