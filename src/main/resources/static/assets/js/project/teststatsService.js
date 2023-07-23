(function() {
'use strict';

var teststatservicedef = function($http) {
	var service = {};
	
	service.getStatistics = function() {
		return $http.get('/stats/categories');
	};
	
	return service;
};

angular.module("app")
.factory("TestStatisticService", ['$http', teststatservicedef]);


})();