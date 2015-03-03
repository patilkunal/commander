/**
 * 
 */

mycontrollers.ScheduleController = function($scope, $location, ScheduleService, MessageService) {
	
	$scope.scheduleList = [];
	
	$scope.getSchedules = function() {
		ScheduleService.getScheduleList().success(function(data, status, headers) {
			$scope.scheduleList = data;			
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	$scope.editSchedule = function(id) {
		$location.url('/schedules/' + id);
	};
	
	$scope.deleteSchedule = function(id) {
		ScheduleService.deleteSchedule(id).success(function(data, status, headers) {
			MessageService.showInfo("Successfully deleted schedule");
			$scope.getSchedules();
		}).error(function(data, status){
			MessageService.showError(data);
		});
	};
	
	$scope.createSchedule = function() {
		$location.url("/schedules/new");
	};
	
	$scope.getSchedules();
};

mycontrollers.ScheduleDetailController = function($scope, $routeParams, $location, ScheduleService, MessageService) {
	$scope.scheduleid = $routeParams.scheduleid;
	$scope.schedule = null;

	if($scope.scheduleid == "new") {
		$scope.schedule = {
			id: -1,
			name: '',
			cronExpression: '',
			active: 'true'
		};
	} else {
		ScheduleService.getSchedule($scope.scheduleid).success(function(data) {
			$scope.schedule = data;
		}).error(function(data){
			MessageService.showError(data);
		});
	}
	
	$scope.saveSchedule = function() {
		ScheduleService.saveSchedule($scope.schedule).success(function(data) {
			MessageService.showInfo("Successfully saved schedule");
			$location.url('/schedules');
		}).error(function(data){
			MessageService.showError(data);
		});
	};
	
	$scope.cancelSave = function() {
		$location.url('/schedules');
	};
	
};