(function() {
'use strict';

 var ScheduleServiceDef = function($http, $q) {
	var service = {};
	
	service.scheduleRestUrl = '/schedules';
	service.cronlistUrl = '/cronlist';
	
	service.getScheduleList = function() {
		return $http({
			method: 'GET',
			url: this.scheduleRestUrl
		});
	};

	service.getSchedule = function(id) {
		return $http({
			method: 'GET',
			url: this.scheduleRestUrl + "/" + id
		});
	};
	
	service.deleteSchedule = function(id) {
		return $http({
			method: 'DELETE',
			url: this.scheduleRestUrl + "/" + id
		});
	};
	
	service.saveSchedule = function(schedule) {
		return $http({
			method: 'POST',
			url: this.scheduleRestUrl,
			data: schedule
		});
	};
	
	service.getCronList = function() {
		return $http({
			method: 'GET',
			url: this.cronlistUrl 
		});
	};
	
	service.pauseScheduler = function() {
		var pause = $http({
			mehtod: 'GET',
			url: '/schedules/scheduler/pause'
		});
		return $q.when(pause).then(function(result) {
			return result.data;
		});
	};

	service.resumeScheduler = function() {
		var pause = $http({
			mehtod: 'GET',
			url: '/schedules/scheduler/resume'
		});
		return $q.when(pause).then(function(result) {
			return result.data;
		});
	};
	
	service.getSchedulerStatus = function() {
		return $http({
			mehtod: 'GET',
			url: '/schedules/scheduler/status'
		});
	};
	
	return service;
};

angular.module("app")
.factory("ScheduleService", ['$http','$q', ScheduleServiceDef]);

})();