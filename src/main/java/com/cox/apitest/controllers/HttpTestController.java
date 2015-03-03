package com.cox.apitest.controllers;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cox.apitest.dao.TestCaseDAO;
import com.cox.apitest.manager.TestManager;
import com.cox.apitest.model.Host;
import com.cox.apitest.model.TestCase;
import com.cox.apitest.model.TestCaseInstance;
import com.cox.apitest.model.TestResult;
import com.cox.apitest.util.RestHttpClient;

@Controller
public class HttpTestController {
	
	private static final Logger logger = Logger.getLogger(HttpTestController.class);
	
	@Autowired
	private RestHttpClient restClient;
	
	@Autowired
	private TestCaseDAO dao;
	
	@Autowired
	private TestManager tm;
	
	@RequestMapping(method=RequestMethod.POST, value="/executeTest/{hostId}", produces="application/json", consumes="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @RequestBody TestCase testCase) throws Exception {
		Host host = dao.getHost(hostid); 
		logger.info("Executing test : " + testCase + " on host " + host);
		return restClient.doHttpRequest(testCase, host);
	}

	@RequestMapping(method=RequestMethod.GET, value="/executeTest/{hostId}/{testinstanceid}", produces="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @PathVariable("testinstanceid") int testInstanceId) throws Exception {
		Host host = dao.getHost(hostid); 
		TestCaseInstance tci = dao.getTestCaseInstance(testInstanceId);
		TestCase tc = dao.getTestCase(tci.getTestCaseId());
		TestCase runTestCase = tm.mergeTestValues(tc, tci);
		TestResult result = restClient.doHttpRequest(runTestCase, host);
		result.setTestInstanceId(tci.getId());
		tm.createTestRun(result);
		return result;
	}
	
}
