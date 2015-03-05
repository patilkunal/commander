(function() {
'use strict';

var teststatservicedef = function($http) {
	var service = {};
	
	service.getStatistics = function() {
		return $http.get('service/stats/categories');
	};
	
	return service;
};

angular.module("app")
.factory("TestStatisticService", ['$http', teststatservicedef]);


})();