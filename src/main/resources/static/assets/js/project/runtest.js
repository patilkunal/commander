(function(){
'use strict';

var initialRunTestDataService = function($q, TestCaseService, HostService) {
	return function() {
		
		var returnobj = {
			testcategories: [],
			testinstances: [],
			hosts: []
		};
		
		return $q.when(TestCaseService.getTestCategories()).then(function(result) {
			var categories = result.data;
			if(angular.isArray(categories)) {
				returnobj.testcategories = categories;
				var selectedCategoryId = categories[0].id; 
				var testInstancePromise = TestCaseService.getTestInstances(selectedCategoryId);	
				var hostDataPromise = HostService.getHostsByCategory(selectedCategoryId);
				//Wait for both promises to get fullfilled
				return $q.all([testInstancePromise, hostDataPromise]).then(function(result){
					var ret = {
						testcategories: categories,
						testinstances: result[0].data,
						hosts: result[1].data
					};
					return ret;
				});
			} else {
				console.log(returnobj);
				return returnobj;
			}
		});
		
		
	};
};

angular.module("app")
.factory("initialRunTestDataService", initialRunTestDataService);

var RunTestControllerDef = function($modal, TestCaseService, HostService, TestExecutorService, TestResultService, MessageService, initialData) {
	
	this.showlist = true;
	this.showtestinstanceform = false;
	
	this.selectedTests = [];

	this.categories = initialData.testcategories;
	this.selectedCategoryId = this.categories[0].id;
	
	this.hosts = initialData.hosts;
	this.selectedHostId = this.hosts[0].id;
	this.selectedHost = this.hosts[0];
	
	this.testInstanceForm = {};
	this.testForm = {};
	
	this.testcaseinstances = initialData.testinstances;
	
	//this.tests = [];
	
	this.toggleSelection = function(id) {
		var idx = this.selectedTests.indexOf(id);

	    // is currently selected
	    if (idx > -1) {
	      this.selectedTests.splice(idx, 1);
	    } else {
	      this.selectedTests.push(id);
	    }
	};
	
	this.runThisTest = function (testid) {
		console.log("Running test for id " + testid);
		var testresults = [];
		
		var ti = this.getTestInstanceById(testid);
		testresults.push({id: ti.id, name: ti.name, result: 'Pending'});
		TestResultService.setTestResults(testresults);

		var modalinstance = $modal.open({
			templateUrl: 'testProgress.html',
			controller: 'TestProgressDialogController',
			size: 'lg', 
			keyboard: true,
			backdrop: 'static'
		});

		TestExecutorService.runTest(this.selectedHost.id, testid)
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
	
	this.runSelectedTests = function() {
		
		var testresults = [];
		for(var i=0; i < this.selectedTests.length; i++) {
			var ti = this.getTestInstanceById(this.selectedTests[i]);
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
		
		for(var i=0; i < this.selectedTests.length; i++) {
			var ti_id = this.selectedTests[i];
			TestExecutorService.runTest(this.selectedHost.id, ti_id)
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
		
		this.selectedTests = [];
	};
	
	
	this.showList = function() {
		this.showlist = true;
		this.showtestinstanceform = false;		
	};
	
	this.showTestInstanceForm = function() {
		this.showlist = false;
		this.showtestinstanceform = true;		
	};
	
	
	this.refresh = function() {
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

		var self = this;
		HostService.getHostsByCategory(this.selectedCategoryId).success(function(data2, status, headers) {
			self.hosts = data2;
			if(self.hosts.length > 0) {
				self.selectedHost = self.hosts[0];
				self.selectedHostId = self.selectedHost.id;
			}
		});

		TestCaseService.getTestInstances(this.selectedCategoryId).success(function(data, status, headers) {
			self.testcaseinstances = data;
			modalInstance.close();
		}).error(function(data, status, headers) {
			modalInstance.close();
			MessageService.showError("Error in refreshing list : " + data);
		});
	};
	
	this.handleHostChange = function() {
		for(var i=0; i < this.hosts.length; i++) {
			if(this.selectedHostId == this.hosts[i].id) {
				this.selectedHost = this.hosts[i];
				break;
			}
		}
	};
	
	this.getTestInstanceById = function(id) {
		for(var i=0; i < this.testcaseinstances.length; i++) {
			if(this.testcaseinstances[i].id == id) 
				return this.testcaseinstances[i];
		}
	};
	
	this.getHostById = function(id) {
		var hostlist = this.hosts;
		for(var i=0; i < hostlist.length; i++) {
			if(hostlist[i].id == id) {
				return hostlist[i];
			}
		}
		return null;
	};
	
	this.editAndRun = function(id) {
		var testCaseInstance = this.getTestInstanceById(id);
		if(testCaseInstance != null) {
			var self = this;
			TestCaseService.getTestCase(testCaseInstance.testCaseId).success(function(data){
				var testcase = data;
			
				//We need resturl, httpmethod which is defined on testcase level
				var url = testcase.restUrl;
				var method = testcase.method;
				
				//The data is defined on test case instance level				
				var testdata = testcase.data;
				
				//Just for debug purpose
				/*
				var host = this.selectedHost.hostname;
				var port = this.selectedHost.port;
				alert(host + " " + port + " " + url + " " + data + " " + method);
				*/
				   
				TestExecutorService.runEditedTest(self.selectedHost.id, url, method, testdata).success(function(respdata){
					alert("Response: " + respdata);
				}).error(function(data, status) {
					alert("Error in executing test");
				});
			});
		} else {
			alert("Unable to find Test Case Instance by id " + id);
		}		
	};
	
	this.editTestInstance = function(id) {
		var self = this;
		var testCaseInstance = this.getTestInstanceById(id);
		if(testCaseInstance != null) {
			this.testInstanceForm.id = testCaseInstance.id;
	 		this.testInstanceForm.name = testCaseInstance.name;
	 		this.testInstanceForm.description = testCaseInstance.description;
	 		this.testInstanceForm.testCaseId = testCaseInstance.testCaseId;
	 		if((testCaseInstance.testCaseValues != null) && (testCaseInstance.testCaseValues.length > 0)) {
	 			this.testInstanceForm.testCaseValues = [];
	 			for ( var i=0; i < testCaseInstance.testCaseValues.length; i++ ) {
	 				var tcv = testCaseInstance.testCaseValues[i];
	 				this.testInstanceForm.testCaseValues.push({
	 					id: tcv.id,
	 					name: tcv.name,
	 					required: tcv.required,
	 					value: tcv.value
	 				});
				}
	 		}
	 		TestCaseService.getTestCase(this.testInstanceForm.testCaseId).success(function(data){
	 			self.testForm = data;
				self.showTestInstanceForm();
	 		}).error(function(){
	 			self.testForm.name = "[Error getting Test Case]";
	 			self.showTestInstanceForm();
	 		});
		} else {
			alert("Unable to find test case instance to edit");
		}
	};
	
	this.cancelEditInstance = function() {
		this.showList();
	};
	
	this.saveTestCaseInstance = function() {
		var self = this;
		TestCaseService.saveTestInstance(this.testInstanceForm).success(function(data){
			self.addToList(data);
			self.showList();
			MessageService.showSuccess("Successfully saved test case instance");
		}).error(function(data, status, headers, config) {
			MessageService.showError("Error saving test case instance");
		});
	};
	
	this.addToList = function(testcaseinstance) {
		var found = false;
		var i=0;
		for(; i < this.testcaseinstances.length; i++) {
			if(testcaseinstance.id == this.testcaseinstances[i].id) {
				found = true;
				break;
			}
		}
		
		if(found) {
			//update existing
			this.testcaseinstances[i] = testcaseinstance;
		} else {
			this.testcaseinstances.push(testcaseinstance);
		}
	};
	
	this.deleteTestInstance = function(id) {
		var self = this;
		if(confirm("Do you really want to delete this test instance?")) {
			TestCaseService.deleteTestInstance(id).then(function(){
				MessageService.showSuccess("Successfully deleted test case instance");
				self.refresh();
			});
		}
	};
	
	this.getCurlForTestInstance = function(id) {
		//then returns data in format {data:'', status:200, config: {method:'', transformRequest:[], transformResponse: [], url:'', headers:{}}, , statusText:'OK'} 
		TestCaseService.getCurl(id, this.selectedHostId).then(function(resp){
			MessageService.showInfo(resp.data);			
		});
	};
};

angular.module("runtests", ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/runtest", {
						templateUrl: "partials/runtest.html", 
						controller: "RunTestController",
						controllerAs: "runtests",
						resolve: { initialData: function(initialRunTestDataService) {
									return initialRunTestDataService();
								} 
						}
		}
);	
}])
.controller("RunTestController", [
                                  '$modal', 
                                  'TestCaseService', 
                                  'HostService', 
                                  'TestExecutorService', 
                                  'TestResultService', 
                                  'MessageService', 
                                  'initialData',                               
                                  RunTestControllerDef]);

})();
