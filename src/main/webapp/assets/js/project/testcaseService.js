(function() {
'use strict';

var testCaseServiceDef = function($http) {
	var testCategoriesURL = "service/categories";
	var hostsURL = "service/hosts";
	var testInstancesURL = "service/testinstances";
	var testCaseUrl = "service/testcase";
	
	var service = {};
	
	service.getTestCategories = function() {
		return $http({
			method: 'GET',
			url: testCategoriesURL
		});
	};
	
	service.getHosts = function() {
		return $http({
			method: 'GET',
			url: hostsURL
		});		
	};
	
	service.getHost = function(id) {
		return $http({
			method: 'GET',
			url: getHostsURL + "/" + id
		});		
		
	};
	
	service.getTestInstances = function(categoryid) {
		return $http({
			method: 'GET',
			url: testInstancesURL + "/category/" + categoryid
		});
	};

	service.getTestInstance = function(id) {
		return $http({
			method: 'GET',
			url: testInstancesURL + "/" + id
		});
	};
	
	service.getTestCase = function(id) {
		return $http({
			method: 'GET',
			url: testCaseUrl + "/" + id
		});
	};
	
	service.getTestCases = function(categoryid) {
		return $http({
			method: 'GET',
			url: testCaseUrl + "/category/" + categoryid
		});	
	};
	
	service.saveTestCase = function(testcase) {
		return $http({
			method: 'POST',
			url: testCaseUrl,
			data: testcase
		});
	};
	
	service.deleteTestCase = function(id) {
		return $http({
			method: 'DELETE',
			url: testCaseUrl + "/" + id
		});
	};
	
	service.createTestInstance = function(testcaseid) {
		return $http({
			method: 'GET',
			url: 'service/testcase/' + testcaseid + '/testinstance',
		});		
	};
	
	service.saveTestInstance = function(testinstance) {
		return $http({
			method: 'POST',
			url: testInstancesURL,
			data: testinstance
		});		
	};
	
	service.deleteTestInstance = function(id) {
		return $http({
			method: 'DELETE',
			url: testInstancesURL + "/" + id
		});
	};
	
	service.getCurl = function(testid, hostid) {
		return $http({
			method: 'GET',
			url: 'service/testinstances/' + testid + '/host/'+ hostid +'/curl',
		});				
	};
	
	service.getTestCaseHistory = function(howmany) {		
		return $http.get('service/testruns/history/' + howmany);
	};
	
	return service;
};

angular.module("app")
.factory("TestCaseService", ['$http', testCaseServiceDef]);


})();