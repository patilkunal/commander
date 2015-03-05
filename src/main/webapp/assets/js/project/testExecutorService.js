(function() {
'use strict';

var testExecutorServiceDef = function($http) {
	var service = {};
	
	service.runTest = function(hostid, testinstanceid) {
			return $http.get('service/executeTest/' + hostid + "/" + testinstanceid);
	};

	service.runEditedTest = function(hostid, url, type, data) {
		var postdata = {
				restUrl: url,
				method: type,
				data: data
			}; 
			return $http.post('service/executeTest/' + hostid, postdata);
	};
	
	return service;
};


angular.module("app")
.factory("TestExecutorService", ['$http', testExecutorServiceDef]);

})();