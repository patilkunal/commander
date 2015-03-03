/**
 * 
 */

//var app = angular.module("app", ['ngResource', 'ngRoute', 'ng.httpLoader', 'angular.jquery'])
var app = angular.module("app", ['ngResource', 'ngRoute', 'ui.bootstrap.tpls', 'ui.bootstrap.modal']);

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

app.factory("httpInterceptor", function(){
	return {
		request: function(config) {
			console.log("request phase");
			//ModalService.open();
			return config;
		},
		response: function(response) {
			console.log("response phase");
			//ModalService.close();
			return response;
		}
	};
});

app.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
	$routeProvider
		.when("/home", {templateUrl: "partials/home.html", controller: "HomeController"})
		.when("/batch", {templateUrl: "partials/batchtests.html", controller: "BatchTestController"})
		.when("/runtest", {templateUrl: "partials/runtest.html", controller: "RunTestController"})
		.when("/definetest", {templateUrl: "partials/definetests.html", controller: "DefineTestController"})
		.when("/host", {templateUrl: "partials/hosts.html", controller: "HostController"})
		.when("/schedules", {templateUrl: "partials/schedules.html", controller: "ScheduleController"})
		.when("/schedules/:scheduleid", {templateUrl: "partials/scheduledetail.html", controller: "ScheduleDetailController"})
		.otherwise({redirectTo: "runtest"});
	$httpProvider.defaults.headers.common.Accept = "application/json, text/plain";
	//$httpProvider.interceptors.push("httpInterceptor");
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
	
	service.showError = function(errmsg) {
		this.errorMessage = errmsg;
		$rootScope.$broadcast('errorHappened');
	};
	
	service.showInfo = function(msg) {
		this.infoMessage = msg;
		$rootScope.$broadcast('infoHappened');
	};
	return service;
};

mycontrollers.MessageServiceController = function($scope, $timeout, MessageService) {
	
	$scope.errorMessage = null;
	$scope.infoMessage = null;
	
	$scope.hideerror = function() {
		$scope.errorMessage = null;
	};
	
	$scope.hideinfo = function() {
		$scope.infoMessage = null;
	};
	
	$scope.$on('errorHappened', function() {
		$scope.errorMessage = null;
		$scope.errorMessage = MessageService.errorMessage;
		//$timeout($scope.hideerror, 5000);
	});
	
	$scope.$on('infoHappened', function() {
		$scope.infoMessage = MessageService.infoMessage;
		//$timeout($scope.hideinfo, 2000);
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
