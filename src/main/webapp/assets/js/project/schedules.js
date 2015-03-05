(function() {

var initialScheduleListDataServiceDef = function($q, ScheduleService) {
	return function() {
		var listpromise = ScheduleService.getScheduleList();
		var statuspromise = ScheduleService.getSchedulerStatus();
		return $q.all([listpromise, statuspromise]).then(function(result) {
			return {
				scheduleList : result[0].data,
				schedulerStatus: result[1].data
			};
		});
	};
};	

angular.module("app").factory("initialScheduleListDataService", initialScheduleListDataServiceDef);

var ScheduleControllerDef = function($location, ScheduleService, MessageService, initialData) {
	
	this.scheduleList = initialData.scheduleList;
	this.schedulerRunning = initialData.schedulerStatus;
	
	this.pauseScheduler = function() {
		ScheduleService.pauseScheduler();
		this.schedulerRunning = false;
	};

	this.resumeScheduler = function() {
		ScheduleService.resumeScheduler();
		this.schedulerRunning = true;
	};
	
	this.getSchedules = function() {
		ScheduleService.getScheduleList().success(function(data, status, headers) {
			this.scheduleList = data;			
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	this.editSchedule = function(id) {
		$location.url('/schedules/' + id);
	};
	
	this.deleteSchedule = function(id) {
		ScheduleService.deleteSchedule(id).success(function(data, status, headers) {
			MessageService.showSuccess("Successfully deleted schedule");
			this.getSchedules();
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	this.createSchedule = function() {
		$location.url("/schedules/new");
	};
	
};

var initialScheduleDetailDataServiceDef = function($q, $route, ScheduleService) {
	return function() {
		var scheduleid = $route.current.params.scheduleid;
		var crontypes = ScheduleService.getCronList();
		if(scheduleid == "new") {
			return $q.when(crontypes).then(function(result) {
				return {
					scheduleDetail : {
						id: -1,
						name: '',
						cronExpression: result.data[0].value,
						active: true
					},
					cronTypes : result.data
				};
			});
		} else {
			var detail = ScheduleService.getSchedule(scheduleid);
			return $q.all([detail, crontypes]).then(function(result){
				return {
					scheduleDetail: result[0].data,
					cronTypes: result[1].data
				};
			});
		}
	};
};

angular.module("app").factory("initialScheduleDetailDataService", initialScheduleDetailDataServiceDef);

var ScheduleDetailControllerDef = function($routeParams, $location, ScheduleService, MessageService, initialData) {
	this.scheduleid = $routeParams.scheduleid;
	this.cronTypeList = initialData.cronTypes;
	this.schedule = initialData.scheduleDetail;
	this.selectedCronType = this.cronTypeList[0].name;

	if(this.scheduleid == "new") {
		this.schedule.cronExpression = this.cronTypeList[0].value;
	}
	this.cexpr = 'NOT SET';
	this.YesNoList = [{ n: 'No', v: false }, { n: 'Yes', v: true }];
	
	this.getCronExpression = function(ctype) {
		for(var i=0; i < this.cronTypeList.length;i++) {
			if(this.cronTypeList[i].name == ctype) {
				return this.cronTypeList[i].value;
			}
		}
		
		return "";
	};
	
	this.saveSchedule = function() {
		ScheduleService.saveSchedule(this.schedule).success(function(data) {
			MessageService.showSuccess("Successfully saved schedule");
			$location.url('/schedules');
		}).error(function(data){
			MessageService.showError(data);
		});
	};
	
	this.cancelSave = function() {
		$location.url('/schedules');
	};
	
	this.setCronExpression = function() {
		if(this.selectedCronType != null) {
			this.schedule.cronExpression = this.getCronExpression(this.selectedCronType);
		}
	};
};

angular.module("schedule", ['ngRoute'])
.controller("ScheduleController", ['$location', 'ScheduleService', 'MessageService', 'initialData', ScheduleControllerDef])
.controller("ScheduleDetailController", ['$routeParams', '$location', 'ScheduleService', 'MessageService', 'initialData', ScheduleDetailControllerDef])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/schedules", {
			templateUrl: "partials/schedules.html", 
			controller: "ScheduleController",
			controllerAs: "scheduleCtrl",
			resolve: { initialData: function(initialScheduleListDataService) {
						return initialScheduleListDataService();
					} 
			}
		})
		.when("/schedules/:scheduleid", {
			templateUrl: "partials/scheduledetail.html", 
			controller: "ScheduleDetailController",
			controllerAs: "scheduleDetailCtrl",
			resolve: { initialData: function(initialScheduleDetailDataService) {
						return initialScheduleDetailDataService();
					} 
			}
		})
		;	
}]);


})();


