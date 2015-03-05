package com.cox.apitest.controllers;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cox.apitest.manager.TestRunManager;
import com.cox.apitest.model.TestCase;
import com.cox.apitest.model.TestResult;

@Controller
public class HttpTestController {
	
	private static final Logger logger = Logger.getLogger(HttpTestController.class);
	
	@Autowired
	private TestRunManager tm;
	
	@RequestMapping(method=RequestMethod.POST, value="/executeTest/{hostId}", produces="application/json", consumes="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @RequestBody TestCase testCase) throws Exception {
		return tm.executeTest(hostid, testCase);
	}

	@RequestMapping(method=RequestMethod.GET, value="/executeTest/{hostId}/{testinstanceid}", produces="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @PathVariable("testinstanceid") int testInstanceId) throws Exception {
		return tm.executeTest(testInstanceId, hostid);
	}
	
}
