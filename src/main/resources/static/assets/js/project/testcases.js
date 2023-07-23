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

/**
 * Factory for initial data for Test case instance
 */
var initialTestCaseInstanceDataServiceDef = function($q, $route, TestCaseService) {
	return function() {
		var testCaseId = $route.current.params.testcaseid;
		var testCasePromise = TestCaseService.getTestCase(testCaseId);
		var newInstancePromise = TestCaseService.createTestInstance(testCaseId);
		return $q.all([testCasePromise, newInstancePromise]).then(function(result){
			return {
				testCase: result[0].data,
				newInstance: result[1].data
			};
		});
	};
};

angular.module("app")
.factory("initialTestCaseInstanceDataService", ['$q', '$route', 'TestCaseService', initialTestCaseInstanceDataServiceDef]);

/**
 * Test Instance Controller
 */
var TestInstanceControllerDef = function($location, $routeParams, TestCaseService, MessageService, initialData) {

	this.testCase = initialData.testCase;
	this.testInstanceForm = initialData.newInstance;
	
	this.testCaseId = $routeParams.testcaseid;
	
	this.saveTestCaseInstance = function() {
		TestCaseService.saveTestInstance(this.testInstanceForm).success(function(data) {
			MessageService.showSuccess("Successfully create test case instance");
			$location.url("/tests");
		}).error(function(data, status){
			MessageService.showError("Error saving test case instance " + status);
		});
	};
	
	this.cancelSave = function() {
		$location.url("/tests");
	};
	
};

/**
 * Factory for initial data for Test Case Detail
 */
var initialTestCaseDetailDataServiceDef = function($q, $route, TestCaseService) {
	return function() {
		var testCaseId = $route.current.params.testcaseid;
		var categories = TestCaseService.getTestCategories();
		var testcase = TestCaseService.getTestCase(testCaseId);
		if(testCaseId == "new") {
			var testcaseobj = new TestCase();
			return $q.when(categories).then(function(result){
				return {
					categories: result.data,
					testCase: testcaseobj
				};
			});
		} else {
			return $q.all([categories, testcase]).then(function(result){
				return {
					categories: result[0].data,
					testCase: result[1].data
				};
			});
		}
	};
};

angular.module("app")
.factory("initialTestCaseDetailDataService", ['$q','$route', 'TestCaseService', initialTestCaseDetailDataServiceDef]);

/**
 * Test Case Detail Controller
 */
var TestCaseDetailControllerDef = function($routeParams, $location, TestCaseService, MessageService, initialData) {
	this.methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
	
	this.testForm = initialData.testCase;
	this.categories = initialData.categories;
	this.selectedCategoryId = this.categories[0].id;
	
	this.testCaseId = $routeParams.testcaseid;
	
	this.saveTest = function() {
		TestCaseService.saveTestCase(this.testForm).success(function(data){
			MessageService.showSuccess("Successfully saved test case");
			$location.url("/tests");
		}).error(function(data, status, headers, config){
			MessageService.showError("Error saving Testcase : " + status);
		});
		
	};
	
	this.cancelSave = function() {
		$location.url("/tests");
	};
	
};

/**
 * Factory for initial Data for Test Case List
 */
var initialTestCaseListDataServiceDef = function($q, TestCaseService) {
	return function() {
		return $q.when(TestCaseService.getTestCategories()).then(function(result){
			var categories = result.data;
			return $q.when(TestCaseService.getTestCases(categories[0].id)).then(function(result){
				return {
					categories: categories,
					testCases: result.data
				};
			});
		});
	};
};

angular.module("app")
.factory("initialTestCaseListDataService", ['$q', 'TestCaseService', initialTestCaseListDataServiceDef]);


/**
 * Test case list controller
 */
var TestCaseListControllerDef = function($location, TestCaseService, MessageService, initialData) {
	this.testcases = initialData.testCases;
	this.categories = initialData.categories;
	this.selectedCategoryId = this.categories[0].id;
	
	this.refresh = function() {
		var self = this;
		TestCaseService.getTestCases(this.selectedCategoryId).success(function(data){
			self.testcases = data;
		});		
	};
	
	this.createTestCase = function() {
		$location.url("/test/new");
	};
	
	this.getTestCase = function(id) {
		for(var i=0; i < this.testcases.length; i++) {
			if(id == this.testcases[i].id) {
				return this.testcases[i];
			}
		}
		return null;
	};
	
	this.deleteTestCase = function(id) {
		var self = this;
		if(confirm("All existing instances will be deleted and you will not be able to run tests.\nDo you really want to delete test case?")) {
			TestCaseService.deleteTestCase(id).success(function(data){
				self.refresh();
			});
		}
	};

	this.editTestCase = function(id) {
		$location.url("/test/" + id);
	};
	
	
	
	this.addToList = function(testcase) {
		var found = false;
		var i=0;
		for(; i < this.testcases.length; i++) {
			if(testcase.id == this.testcases[i].id) {
				found = true;
				break;
			}
		}
		
		if(found) {
			//update existing
			this.testcases[i] = testcase;
		} else {
			this.testcases.push(testcase);
		}
	};
	
	this.createTestCaseInstance = function(testCaseId) {
		$location.url("/newinstance/" + testCaseId);
	};
	
};

angular.module("testcases", ["ngRoute"])
.controller("TestInstanceController", ['$routeParams', '$location', 'TestCaseService', 'MessageService', 'initialData', TestInstanceControllerDef])
.controller("TestCaseDetailController", ['$routeParams', '$location', 'TestCaseService', 'MessageService', 'initialData', TestCaseDetailControllerDef])
.controller("TestCaseListController", ['$location', 'TestCaseService', 'MessageService', 'initialData', TestCaseListControllerDef])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/tests", {
			templateUrl: "partials/testcases.html", 
			controller: "TestCaseListController",
			controllerAs: "testcaselist",
			resolve: { initialData: function(initialTestCaseListDataService) {
						return initialTestCaseListDataService();
					} 
			}
		})
		.when("/test/:testcaseid", {
			templateUrl: "partials/testcasedetail.html", 
			controller: "TestCaseDetailController",
			controllerAs: "testcasedetail",
			resolve: { initialData: function(initialTestCaseDetailDataService) {
						return initialTestCaseDetailDataService();
					} 
			}
		})
		.when("/newinstance/:testcaseid", {
			templateUrl: "partials/testinstance.html", 
			controller: "TestInstanceController",
			controllerAs: "testinstance",
			resolve: { initialData: function(initialTestCaseInstanceDataService) {
						return initialTestCaseInstanceDataService();
					} 
			}
		});
}]);

})();
