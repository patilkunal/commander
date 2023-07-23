package com.inovisionsoftware.apitest.controllers;

import com.inovisionsoftware.apitest.manager.TestRunManager;
import com.inovisionsoftware.apitest.model.TestCase;
import com.inovisionsoftware.apitest.model.TestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/executeTest")
public class HttpTestController {
	
	private static final Logger logger = LoggerFactory.getLogger(HttpTestController.class);
	
	@Autowired
	private TestRunManager tm;
	
	@RequestMapping(method=RequestMethod.POST, value="/{hostId}", produces="application/json", consumes="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @RequestBody TestCase testCase) throws Exception {
		return tm.executeTest(hostid, testCase);
	}

	@RequestMapping(method=RequestMethod.GET, value="/{hostId}/{testinstanceid}", produces="application/json")
	public @ResponseBody TestResult executeTest(@PathVariable("hostId") int hostid, @PathVariable("testinstanceid") int testInstanceId) throws Exception {
		return tm.executeTest(testInstanceId, hostid);
	}
	
}
