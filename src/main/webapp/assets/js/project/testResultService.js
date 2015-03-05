(function() {
'use strict';

/**
 * This service provides the interface between TestExecutor and the dialog box showing the
 * progress of the test execution. CAN DO BETTER!!
 * 
 */
var testResultServiceDev = function($rootScope) {
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
				if(obj.success) {
					this.testresults[i].result = obj.result;
				} else {
					this.testresults[i].result = obj.error;
				}
				$rootScope.$broadcast('handleBroadcast');
			}
		}
	};
	
	return service;
};


angular.module("app")
.factory("TestResultService", ['$rootScope', testResultServiceDev]);

})();