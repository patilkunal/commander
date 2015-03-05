/**
 * 
 */

mycontrollers.ScheduleController = function($scope, $location, ScheduleService, MessageService) {
	
	$scope.scheduleList = [];
	$scope.schedulerRunning = true;
	
	$scope.pauseScheduler = function() {
		ScheduleService.pauseScheduler();
		$scope.schedulerRunning = false;
	};

	$scope.resumeScheduler = function() {
		ScheduleService.resumeScheduler();
		$scope.schedulerRunning = true;
	};
	
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
			MessageService.showSuccess("Successfully deleted schedule");
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

mycontrollers.ScheduleDetailController = ['$scope', '$routeParams', '$location', 'ScheduleService', 'MessageService', 
                                          function($scope, $routeParams, $location, ScheduleService, MessageService) {
	$scope.scheduleid = $routeParams.scheduleid;
	$scope.cronTypeList = [];
	$scope.selectedCronType = null;
	
	$scope.cexpr = 'NOT SET';
	
	$scope.schedule = {
			id: -1,
			name: '',
			cronExpression: '',
			active: 'true'
		};

	$scope.getCronExpression = function(ctype) {
		for(var i=0; i < $scope.cronTypeList.length;i++) {
			if($scope.cronTypeList[i].name == ctype) {
				return $scope.cronTypeList[i].value;
			}
		}
		
		return "";
	};
	
	ScheduleService.getCronList().success(function(data){
		$scope.cronTypeList = data;
		$scope.selectedCronType = $scope.cronTypeList[0].name;
		$scope.schedule.cronExpression = $scope.cronTypeList[0].value;
		if($scope.scheduleid != "new") {
			ScheduleService.getSchedule($scope.scheduleid).success(function(data) {
				$scope.schedule = data;
			}).error(function(data){
				MessageService.showError(data);
			});
		}
	});
	
	$scope.saveSchedule = function() {
		ScheduleService.saveSchedule($scope.schedule).success(function(data) {
			MessageService.showSuccess("Successfully saved schedule");
			$location.url('/schedules');
		}).error(function(data){
			MessageService.showError(data);
		});
	};
	
	$scope.cancelSave = function() {
		$location.url('/schedules');
	};
	
	$scope.setCronExpression = function() {
		if($scope.selectedCronType != null) {
			$scope.schedule.cronExpression = $scope.getCronExpression($scope.selectedCronType);
		}
	};
	
	
}];