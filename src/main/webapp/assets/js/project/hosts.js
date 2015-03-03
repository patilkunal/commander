var Host = function() {
	this.id = -1;
	this.hostname = '';
	this.port = '8080';
	this.name = '';
	this.secureHttp = false;
	this.testCategoryId = 0;
};

mycontrollers.HostController = function($scope, $timeout, HostService, TestCaseService, MessageService) {
	$scope.showlist = true;
	$scope.showHostForm = false;
/*	
	$scope.errormessage = null;
	$scope.infomessage = null;
	
	$scope.hideinfo = function() {
		$scope.infomessage = null;		
	};

	$scope.info = function(msg) {
		$scope.errormessage = null;
		$scope.infomessage = msg;
		$timeout($scope.hideinfo, 2000);
	};
	
	$scope.error = function(msg) {
		$scope.errormessage = msg;
		$scope.infomessage = null;		
	};	
*/	
	$scope.showList = function() {
		$scope.showlist = true;
		$scope.showHostForm = false;
	};
	
	$scope.showForm = function() {
		$scope.showlist = false;
		$scope.showHostForm = true;		
	};
	
	$scope.hostForm = {};
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
		$scope.hostForm = new Host();
		$scope.hostForm.testCategoryId = $scope.categories[0].id;  
		$scope.showForm();
	};
	
	$scope.editHost = function(id) {
		var host = $scope.getHost(id);
		if(host != null) {
			$scope.hostForm.id = host.id;
			$scope.hostForm.name = host.name;
			$scope.hostForm.hostname = host.hostname;
			$scope.hostForm.port = host.port;
			$scope.hostForm.secureHttp = host.secureHttp;
			$scope.hostForm.testCategoryId = host.testCategoryId;
			$scope.showForm();
		} else {
			MessageService.showError("Unable to find the host with id " + id);
		}
	};
	
	$scope.cancelSave = function() {
		$scope.hostForm = {};
		$scope.showList();
	};
	
	$scope.deleteHost = function(id) {
		if(confirm("Do you really want to delete the host?")) {
			HostService.deleteHost(id).success(function(data, status) {
				$scope.refresh();
			});
		}
	};
	
	$scope.saveHost = function() {
		HostService.saveHost($scope.hostForm).success(function(data){
			MessageService.showInfo("Successfully updated host " + data.name);
			$scope.refresh();
			$scope.showList();
		}).error(function(data, status){
			MessageService.showError("Error is saving host : " + data);
		});
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

mycontrollers.HostDetailController = function($scope) {
	
};