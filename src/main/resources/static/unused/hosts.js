(function(){
	
var Host = function() {
	this.id = -1;
	this.hostname = '';
	this.port = '8080';
	this.name = '';
	this.secureHttp = false;
	this.testCategoryId = 0;
};

mycontrollers.HostDetailController = function($scope, $routeParams, $location, HostService, TestCaseService, MessageService) {
	$scope.hostid = $routeParams.hostid;
	$scope.hostForm = null;
	$scope.categories = [];
	
	TestCaseService.getTestCategories().success(function(data, status, headers) {
		$scope.categories = data;
		if($scope.hostid == "new") {
			$scope.hostForm = new Host();
			$scope.hostForm.testCategoryId = $scope.categories[0].id;		
		} else {
			$scope.hostForm = {};
			HostService.getHost($scope.hostid).success(function(data, status) {
				$scope.hostForm = data;
			}).error(function(data) {
				MessageService.showError(data);
			});
		}
	});
	
	$scope.saveHost = function() {
		HostService.saveHost($scope.hostForm).success(function(data){
			MessageService.showSuccess("Successfully updated host " + data.name);
			$scope.refresh();
			$scope.showList();
		}).error(function(data, status){
			MessageService.showError("Error is saving host : " + data);
		});
	};

	$scope.cancelSave = function() {
		$location.url("/host");
	};
	
};

mycontrollers.HostController = function($scope, $location, HostService, TestCaseService, MessageService) {
	$scope.hosts = [];
	$scope.categories = [];
	
	TestCaseService.getTestCategories().success(function(data, status, headers) {
		$scope.categories = data;
		
		HostService.getHosts().success(function(data, status) {
			$scope.hosts = data;
		});
	});
	
	$scope.refresh = function() {
		HostService.getHosts().success(function(data, status) {
			$scope.hosts = data;
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	$scope.addNewHost = function() {
		$location.url("/host/new");
	};
	
	$scope.editHost = function(id) {
		$location.url("/host/" + id);
	};
	
	
	$scope.deleteHost = function(id) {
		if(confirm("Do you really want to delete the host?")) {
			HostService.deleteHost(id).success(function(data, status) {
				$scope.refresh();
				MessageService.showInfo("Successfully deleted Host");
			}).error(function(data) {
				MessageService.showError("Error in deleting host.");
			});
		}
	};
	
	$scope.getHost = function(id) {
		if(angular.isArray($scope.hosts) &&  ($scope.hosts.length > 0)) {
			for(var i=0; i < $scope.hosts.length; i++) {
				if($scope.hosts[i].id == id) {
					return $scope.hosts[i];
				}
			}
		}
		
		return null;
	};
	
};

})();
