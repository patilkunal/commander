(function() {
'use strict';

var genericErrorHandlerDef = function(MessageService) {
	//used to handle error condition from $http.error
	return function(data, status) {
		MessageService.showError(data);
	};
}; 

angular.module("app")
.factory('genericErrorHandler', ['MessageService', genericErrorHandlerDef]);

})();

//myservices.genericErrorHandler = function(MessageService) {
//	//used to handle error condition from $http.error
//	return function(data, status) {
//		MessageService.showError(data);
//	};
//};

//myservices.TestStatisticService = function($http) {
//	var service = {};
//	
//	service.getStatistics = function() {
//		return $http.get('service/stats/categories');
//	};
//	
//	return service;
//};

//myservices.TestExecutorService = function($http) {
//	var service = {};
//	
//	service.runTest = function(hostid, testinstanceid) {
//			return $http.get('service/executeTest/' + hostid + "/" + testinstanceid);
//	};
//
//	service.runEditedTest = function(hostid, url, type, data) {
//		var postdata = {
//				restUrl: url,
//				method: type,
//				data: data
//			}; 
//			return $http.post('service/executeTest/' + hostid, postdata);
//	};
//	
//	return service;
//};
