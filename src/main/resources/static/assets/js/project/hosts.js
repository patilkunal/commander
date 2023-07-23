(function(){
	
var Host = function() {
	this.id = -1;
	this.hostname = '';
	this.port = '8080';
	this.name = '';
	this.secureHttp = false;
	this.testCategoryId = 0;
};

var initialHostDetailDataServiceDef = function($route, $q, HostService, TestCaseService) {
	return function() {
		var hostid = $route.current.params.hostid;
		var categories = TestCaseService.getTestCategories();
		var host = HostService.getHost(hostid);
		if(hostid == 'new') {
			return $q.when(categories).then(function(result){
				return {
					host: (new Host()),
					categories: result.data
				};
			});
		} else {
			return $q.all([categories, host]).then(function(result){
				return {
					categories : result[0].data,
					host: result[1].data
				};
			});
		}
	};
};

angular.module("app")
.factory("initialHostDetailDataService", ['$route', '$q', 'HostService', 'TestCaseService', initialHostDetailDataServiceDef]);

var HostDetailControllerDef = function($routeParams, $location, HostService, TestCaseService, MessageService, initialData) {
	this.hostid = $routeParams.hostid;
	this.hostForm = initialData.host;
	this.categories = initialData.categories;
	
	this.saveHost = function() {
		var self = this;
		HostService.saveHost(this.hostForm).success(function(data){
			MessageService.showSuccess("Successfully updated host " + data.name);
			self.refresh();
			self.showList();
		}).error(function(data, status){
			MessageService.showError("Error is saving host : " + data);
		});
	};

	this.cancelSave = function() {
		$location.url("/host");
	};
	
};

var initialHostListDataServiceDef = function($q, HostService) {
	return function() {
		var hosts = HostService.getHosts();
		return $q.when(hosts).then(function(result){
			return {
				hosts: result.data
				};
		});
	};
};

angular.module("app")
.factory("initialHostListDataService", ["$q", "HostService", initialHostListDataServiceDef]);

var HostListControllerDef = function($location, HostService, TestCaseService, MessageService, initialData) {
	this.hosts = initialData.hosts;
	
	this.refresh = function() {
		var self = this;
		HostService.getHosts().success(function(data, status) {
			self.hosts = data;
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	this.addNewHost = function() {
		$location.url("/host/new");
	};
	
	this.editHost = function(id) {
		$location.url("/host/" + id);
	};
	
	
	this.deleteHost = function(id) {
		var self = this;
		if(confirm("Do you really want to delete the host?")) {
			HostService.deleteHost(id).success(function(data, status) {
				self.refresh();
				MessageService.showInfo("Successfully deleted Host");
			}).error(function(data) {
				MessageService.showError("Error in deleting host.");
			});
		}
	};
	
	this.getHost = function(id) {
		if(angular.isArray(this.hosts) &&  (this.hosts.length > 0)) {
			for(var i=0; i < this.hosts.length; i++) {
				if(this.hosts[i].id == id) {
					return this.hosts[i];
				}
			}
		}
		
		return null;
	};
	
};

angular.module("host", ['ngRoute'])
.controller("HostListController", ['$location', 'HostService', 'TestCaseService', 'MessageService', 'initialData', HostListControllerDef])
.controller("HostDetailController", ['$routeParams','$location', 'HostService', 'TestCaseService', 'MessageService', 'initialData', HostDetailControllerDef])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/host", {
			templateUrl: "partials/hosts.html", 
			controller: "HostListController",
			controllerAs: "hostCtrl",
			resolve: { initialData: function(initialHostListDataService) {
						return initialHostListDataService();
					} 
			}
		})
		.when("/host/:hostid", {
			templateUrl: "partials/hostdetail.html", 
			controller: "HostDetailController",
			controllerAs: "hostDetailCtrl",
			resolve: { initialData: ["initialHostDetailDataService", function(initialHostDetailDataService) {
						return initialHostDetailDataService();
					} ]
			}
		})
		;	
}]);

})();
