var initialHomeDataService = function($q, TestCaseService, TestStatisticService) {
	//example of factory returning a function instead of object;
	return function() {
		console.log("Invoking initialHome Data Service");
		var historyDataPromise = TestCaseService.getTestCaseHistory(10);
		var chartDataPromise = TestStatisticService.getStatistics();
		return $q.all([historyDataPromise, chartDataPromise]).then(function(result){
			return {
				runHistoryData: result[0].data,
				chartData: result[1].data
			};
		});
	};
};

angular.module("app").factory("initialHomeDataService", initialHomeDataService);


var HomeControllerDef = function ($rootScope, $modal, TestStatisticService, genericErrorHandler, 
		TestCaseService, TestExecutorService, TestResultService, initialData) {

	this.opendialog = function() {
		$rootScope.openProgressDialog();
	};
	
	this.closedialog = function() {
		$rootScope.closeProgressDialog();
	};
	
	this.piedata = [];
	
	this.bardata = [];
	this.barcategories = [];
	this.barseries = [{ "label" : "Success", "color" : "#46995D"}, { "label" : "Failed", "color" : "#CC3300"} ];
	
	this.recenttests = [];
	this.testrunhistory = initialData.runHistoryData;

	this.getRunHistory = function() {
		TestCaseService.getTestCaseHistory(10).success(function(data, status){
			this.testrunhistory = data;
		}).error(function(data, status) { genericErrorHandler(data, status); });
	};
	
	this.formatChartData = function(data) {
		if(angular.isArray(data)) {
			var success = [];
			var failures = [];
			this.barcategories = [];
			for(var i=0; i < data.length; i++) {
				this.barcategories.push(data[i].category);
				success.push(data[i].success);
				failures.push(data[i].failures);
				
				//populate pie data just for BATCH type values
				if("BATCH" == data[i].category) {
					this.piedata = [];
					this.piedata.push(["Success", data[i].success]);
					this.piedata.push(["Failures", data[i].failures]);
				}
			}
			//this.barcategories = categories;
			this.bardata = [];
			this.bardata.push(success); this.bardata.push(failures);
			
		} else {
			genericErrorHandler("Statistics by category call returned invalid data");
		}		
	};
	
	this.getChartData = function() {
		TestStatisticService.getStatistics().success(function(data, status){
			this.formatChartData(data);
		}).error(function(data, status) { genericErrorHandler(data, status); });
	};
	
	this.runThisTest = function (testid, hostid) {
		//get the test instance and then run the test 
		TestCaseService.getTestInstance(testid).success(function(data, status) {
			//TODO: how do we get which HOST did the test ran on???
			console.log("Running test for id " + testid);
			var testresults = [];
			
			var ti = data;
			testresults.push({id: ti.id, name: ti.name, result: 'Pending'});
			TestResultService.setTestResults(testresults);

			var modalinstance = $modal.open({
				templateUrl: 'testProgress.html',
				controller: 'TestProgressDialogController',
				size: 'lg', 
				keyboard: true,
				backdrop: 'static'
			});

			TestExecutorService.runTest(hostid, testid)
			   .success(function(data,status,header,config) {
					var respstring = data;
					if(angular.isObject(data)) {
						respstring = angular.toJson(data);
					}
					TestResultService.updateTestResult(respstring);			
				}).error(function(data, status, headers, config) {
					console.log(data);
					var respstring = data;
					if(angular.isObject(data)) {
						respstring = angular.toJson(data);
					}
					TestResultService.updateTestResult(respstring);
					//TestResultService.updateTestResult(data);
				});
			
			this.getChartData();
			this.getRunHistory();
			
		}).error(function(data, status) { genericErrorHandler(data); });
	};
	
	this.getTestInstanceById = function(id) {
		TestCaseService.getTestInstance(id);
	};
	
	this.formatChartData(initialData.chartData);

};

angular.module("home", ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/home", {
						templateUrl: "partials/home.html", 
						controller: "HomeController",
						controllerAs: "home",
						resolve: { initialData: function(initialHomeDataService) {
									console.log("Invoking resolve to resolve initialData");
									return initialHomeDataService();
								} 
						}
		});	
}])
.controller("HomeController", [
                               '$rootScope', 
                               '$modal', 
                               'TestStatisticService', 
                               'genericErrorHandler', 
                               'TestCaseService', 
                               'TestExecutorService', 
                               'TestResultService', 'initialData', //initialData comes from the resolve
                               HomeControllerDef]);
