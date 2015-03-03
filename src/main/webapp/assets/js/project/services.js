/**
 * 
 */

myservices.TestExecutorService = function($http) {
	var service = {};
	
	service.runTest = function(hostid, testinstanceid) {
			return $http.get('service/executeTest/' + hostid + "/" + testinstanceid);
	};

	service.runEditedTest = function(hostid, url, type, data) {
		var postdata = {
				restUrl: url,
				method: type,
				data: data
			}; 
			return $http.post('service/executeTest/' + hostid, postdata);
	};
	
	return service;
};

myservices.HostService = function($http) {
	var hostUrl = "service/hosts";
	
	var service = {};
	
	service.getHosts = function() {
		return $http({
			method: 'GET',
			url: hostUrl 
		});		
	};

	service.getHostsByCategory = function(categoryId) {
		return $http({
			method: 'GET',
			url: hostUrl + "/category/" + categoryId
		});		
	};

	service.deleteHost = function(id) {
		return $http({
			method: 'DELETE',
			url: hostUrl + "/" +id
		});				
	};
	
	service.updateHost = function(host) {
		return $http({
			method: 'PUT',
			url: hostUrl + "/" + host.id,
			data: host
		});
	};

	service.saveHost = function(host) {
		return $http({
			method: 'POST',
			url: hostUrl,
			data: host
		});
	};
	
	return service;
};

myservices.TestCaseService = function($http) {
	var testCategoriesURL = "service/categories";
	var hostsURL = "service/hosts";
	var testInstancesURL = "service/testinstances";
	var testCaseUrl = "service/testcase";
	
	var service = {};
	
	service.getTestCategories = function() {
		return $http({
			method: 'GET',
			url: testCategoriesURL
		});
	};
	
	service.getHosts = function() {
		return $http({
			method: 'GET',
			url: hostsURL
		});		
	};
	
	service.getHost = function(id) {
		return $http({
			method: 'GET',
			url: getHostsURL + "/" + id
		});		
		
	};
	
	service.getTestInstances = function(categoryid) {
		return $http({
			method: 'GET',
			url: testInstancesURL + "/category/" + categoryid
		});
	};

	service.getTestInstance = function(id) {
		return $http({
			method: 'GET',
			url: testInstancesURL + "/" + id
		});
	};
	
	service.getTestCase = function(id) {
		return $http({
			method: 'GET',
			url: testCaseUrl + "/" + id
		});
	};
	
	service.getTestCases = function(categoryid) {
		return $http({
			method: 'GET',
			url: testCaseUrl + "/category/" + categoryid
		});	
	};
	
	service.saveTestCase = function(testcase) {
		return $http({
			method: 'POST',
			url: testCaseUrl,
			data: testcase
		});
	};
	
	service.deleteTestCase = function(id) {
		return $http({
			method: 'DELETE',
			url: testCaseUrl + "/" + id
		});
	};
	
	service.createTestInstance = function(testcaseid) {
		return $http({
			method: 'GET',
			url: 'service/testcase/' + testcaseid + '/testinstance',
		});		
	};
	
	service.saveTestInstance = function(testinstance) {
		return $http({
			method: 'POST',
			url: testInstancesURL,
			data: testinstance
		});		
	};
	
	service.deleteTestInstance = function(id) {
		return $http({
			method: 'DELETE',
			url: testInstancesURL + "/" + id
		});
	};
	
	service.getCurl = function(testid, hostid) {
		return $http({
			method: 'GET',
			url: 'service/testinstances/' + testid + '/host/'+ hostid +'/curl',
		});				
	};
	
	return service;
};

myservices.ScheduleService = function($http) {
	var service = {};
	
	service.scheduleRestUrl = 'service/schedules';
	
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
	
	return service;
};
