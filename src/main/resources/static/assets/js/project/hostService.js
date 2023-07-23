(function() {
'use strict';

var HostServiceDef = function($http) {
	var hostUrl = "/hosts";
	
	var service = {};
	
	service.getHosts = function() {
		return $http({
			method: 'GET',
			url: hostUrl 
		});		
	};

	service.getHost = function(id) {
		return $http({
			method: 'GET',
			url: hostUrl + "/" + id
		});		
	};
	
	service.getHostsByCategory = function(categoryId) {
		return $http({
			method: 'GET',
			url: hostUrl + "/category/" + categoryId
		});		
	};

	service.deleteHost = function(id) {
		return $http({
			method: 'DELETE',
			url: hostUrl + "/" +id
		});				
	};
	
	service.updateHost = function(host) {
		return $http({
			method: 'PUT',
			url: hostUrl + "/" + host.id,
			data: host
		});
	};

	service.saveHost = function(host) {
		return $http({
			method: 'POST',
			url: hostUrl,
			data: host
		});
	};
	
	return service;
};

angular.module("app")
.factory("HostService", ['$http', HostServiceDef]);


})();