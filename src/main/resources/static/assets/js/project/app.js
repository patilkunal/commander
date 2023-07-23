var app = angular.module("app", ['ngResource', 'ngRoute', 'ui.bootstrap.tpls', 'ui.bootstrap.modal', 'home', 'runtests', 'schedule', 'testcases', 'host']);
app.constant('UserData', {
	name: ''
});

var mycontrollers = {};
var myservices = {};

app.controller(mycontrollers);
app.factory(myservices);


mycontrollers.MenuController = ["$scope", "$location", function($scope, $location) {
	$scope.getClass = function(mypath) {
		if($location.path().substr(0, mypath.length) == mypath) {
			return "active";
		} else {
			return "";
		}
	};
}];

myservices.ModalService = ["$modal", function($modal){
	return {
		ddialog: null,
		open: function() {
			this.ddialog = $modal.open({
				templateUrl: 'progressModal.html',
				size: 'sm',
				keyboard: false,
				backdrop: 'static'
			});			
		},
		close: function() {
			this.ddialog.close();
		}
	};
}];

myservices.TestProgressService = ["$modal", function($modal){
	return {
		ddialog: null,
		open: function() {
			this.ddialog = $modal.open({
				templateUrl: 'testProgress.html',
				size: 'lg',
				keyboard: false,
				backdrop: 'static'
			});			
		},
		close: function() {
			this.ddialog.close();
		}
	};
}];

app.factory("myhttpInterceptor", function(){
	return {
		'request': function(config) {
			console.log("request phase");
			//ModalService.open();
			return config;
		},
		'response': function(response) {
			console.log("response phase");
			//ModalService.close();
			return response;
		}
	};
});

app.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
	$routeProvider
		.otherwise({redirectTo: "home"});
	//we use default header types
	//$httpProvider.defaults.headers.common.Accept = "application/json, text/plain";
	//$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w'
	//$httpProvider.interceptors.push("myhttpInterceptor");
}]);

/*
app.run(function($rootScope, $modal){
	$rootScope.progressDialog = null;
	
	$rootScope.openProgressDialog = function() {
		$rootScope.progressDialog = $modal.open({
			templateUrl: 'progressModal.html',
			size: 'sm'
		});
	};
	
	$rootScope.closeProgressDialog = function() {
		if($rootScope.progressDialog != null)
			$rootScope.progressDialog.close();
	};
});

*/

myservices.MessageService = function($rootScope) {
	var service = {};
	
	service.errorMessage = null;
	service.infoMessage = null;
	service.successMessage = null;
	
	service.showError = function(errmsg) {
		this.errorMessage = errmsg;
		$rootScope.$broadcast('errorHappened');
	};
	
	service.showSuccess = function(msg) {
		this.successMessage = msg;
		$rootScope.$broadcast('successHappened');
	};

	service.showInfo = function(msg) {
		this.infoMessage = msg;
		$rootScope.$broadcast('infoHappened');
	};
	
	return service;
};

mycontrollers.MessageServiceController = function($scope, MessageService) {
	
	$scope.errorMessage = null;
	$scope.infoMessage = null;
	$scope.successMessage = null;
	
	$scope.hideerror = function() {
		$scope.errorMessage = null;
	};
	
	$scope.hideinfo = function() {
		$scope.infoMessage = null;
	};

	$scope.hidesuccess = function() {
		$scope.successMessage = null;
	};
	
	$scope.$on('errorHappened', function() {
		$scope.errorMessage = MessageService.errorMessage;
	});
	
	$scope.$on('infoHappened', function() {
		$scope.infoMessage = MessageService.infoMessage;
	});

	$scope.$on('successHappened', function() {
		$scope.successMessage = MessageService.successMessage;
	});
};

mycontrollers.ProgressDialogController = function($scope, $modalInstance, message) {
	$scope.message = message;
};

mycontrollers.TestProgressDialogController = function($scope, $modalInstance, TestResultService) {
	$scope.tests = TestResultService.testresults;
	
	$scope.showclose = false;
	
	$scope.$on('handleBroadcast', function() {
		$scope.tests = TestResultService.testresults;
		var i=0;
		for(; i < $scope.tests.length; i++) {
			if("Pending" == $scope.tests[i].result) {
				break;
			}
		}
		if(i == $scope.tests.length) {
			$scope.showclose = true;
		}
    });
	
	$scope.close = function() {
		$modalInstance.close();
	};
	
};
