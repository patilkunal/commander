package com.cox.apitest.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cox.apitest.dao.TestCaseDAO;
import com.cox.apitest.manager.TestRunManager;
import com.cox.apitest.model.Host;
import com.cox.apitest.model.TestCase;
import com.cox.apitest.model.TestCaseCategory;
import com.cox.apitest.model.TestCaseInstance;
import com.cox.apitest.model.TestCaseRun;
import com.cox.apitest.model.TestCaseRunFilter;
import com.cox.apitest.util.ValueParser;

@Controller
public class TestCaseController {

	private static final String CURL_FORMAT = "curl -X %s -H \"Content-Type: application/json; version=1.0\" -H \"Accept: application/json\" -i -d '%s' \"%s\"";
	
	@Autowired
	private TestCaseDAO dao;
	
	@Autowired
	private TestRunManager tm;
	
	@RequestMapping(produces="application/json", value="/categories", method=RequestMethod.GET)
	public @ResponseBody List<TestCaseCategory> getTestCaseCategories() {		
		return dao.getTestCategories();
	}

	@RequestMapping(produces="application/json", value="/categories/{id}", method=RequestMethod.GET)
	public @ResponseBody TestCaseCategory getTestCaseCategory(@PathVariable("id") int id) {		
		return dao.getTestCategory(id);
	}

	@RequestMapping(produces="application/json", value="/categories", method=RequestMethod.POST)
	public @ResponseBody TestCaseCategory saveTestCaseCategory(@RequestBody TestCaseCategory tc) {		
		return dao.saveTestCategory(tc);
	}

	@RequestMapping(produces="application/json", value="/categories/{id}", method=RequestMethod.PUT)
	public @ResponseBody TestCaseCategory updateTestCaseCategory(@RequestBody TestCaseCategory tc) {		
		return dao.saveTestCategory(tc);
	}

	@RequestMapping(produces="application/json", value="/testinstances/category/{categoryId}", method=RequestMethod.GET)
	public @ResponseBody List<TestCaseInstance> getTestCaseInstances(@PathVariable("categoryId") int categoryId) {		
		return dao.getTestCaseInstances(categoryId);
	}
	
	@RequestMapping(produces="application/json", value="/testinstances/{id}", method=RequestMethod.GET)
	public @ResponseBody TestCaseInstance getTestCaseInstance(@PathVariable("id") int id) {		
		return dao.getTestCaseInstance(id);
	}
	
	@RequestMapping(produces="application/json", value="/testinstances", method=RequestMethod.POST)
	public @ResponseBody TestCaseInstance saveTestCaseInstance(@RequestBody TestCaseInstance ti) {
		return dao.saveTestCaseInstance(ti);
	}

	@RequestMapping(produces="application/json", value="/testinstances/{id}", method=RequestMethod.PUT)
	public @ResponseBody TestCaseInstance updateTestCaseInstance(@RequestBody TestCaseInstance ti) {
		return dao.saveTestCaseInstance(ti);
	}

	@RequestMapping(produces="application/json", value="/testinstances/{id}", method=RequestMethod.DELETE)
	public @ResponseBody TestCaseInstance deleteTestCaseInstance(@PathVariable("id") int id) {
		TestCaseInstance tc = getTestCaseInstance(id);
		dao.deleteTestCaseInstance(id);
		return tc;
	}
	
	@RequestMapping(produces="application/json", value="/testcase/{id}", method=RequestMethod.PUT)
	public @ResponseBody TestCase updateTestCase(@RequestBody TestCase testCase) {
		return dao.saveTestCase(testCase);
	}

	@RequestMapping(produces="application/json", value="/testcase", method=RequestMethod.POST)
	public @ResponseBody TestCase saveTestCase(@RequestBody TestCase testCase) {
		return dao.saveTestCase(testCase);
	}
	
	@RequestMapping(produces="application/json", value="/testcase/{id}", method=RequestMethod.GET)
	public @ResponseBody TestCase getTestCase(@PathVariable("id") int id) {		
		return dao.getTestCase(id);
	}

	@RequestMapping(produces="application/json", value="/testcase/category/{categoryid}", method=RequestMethod.GET)
	public @ResponseBody List<TestCase> getTestCases(@PathVariable("categoryid") int categoryId) {		
		return dao.getTestCases(categoryId);
	}
	
	@RequestMapping(produces="application/json", value="/testcase/{id}", method=RequestMethod.DELETE)
	public @ResponseBody TestCase deleteTestCase(@PathVariable("id") int id) {
		TestCase tc = getTestCase(id);		
		dao.deleteTestCase(id);
		return tc;
	}	
	
	@RequestMapping(produces="application/json", value="/testruns/category/{categoryId}", method=RequestMethod.GET)
	public @ResponseBody List<TestCaseRun> getTestCaseRuns(@PathVariable("categoryId") int categoryId) {
		TestCaseRunFilter filter = new TestCaseRunFilter();
		filter.setTestCaseCategoryId(categoryId);
		return dao.getTestCaseRuns(filter);
	}
	
	@RequestMapping(value="/testruns/history/{count}", method=RequestMethod.GET)
	public @ResponseBody List<TestCaseRun> getTestCaseRunHistory(@PathVariable("count") int count) {
		TestCaseRunFilter filter = new TestCaseRunFilter();
		filter.setHistoryCount(count);
		return dao.getTestCaseRuns(filter);
	}
	
	@RequestMapping(produces="application/json", value="/testcase/{id}/testinstance", method=RequestMethod.GET)
	public @ResponseBody TestCaseInstance createTestCaseInstance(@PathVariable("id") int id) {		
		TestCase testCase = dao.getTestCase(id);
		TestCaseInstance instance = null;
		if(testCase != null) {
			instance = new TestCaseInstance();
			instance.setTestCaseId(testCase.getId());
			instance.setName(testCase.getName() + " Instance");
			instance.setDescription(testCase.getName() + " Instance");
			instance.setTestCaseValues(ValueParser.parseTestCaseValues(testCase.getRestUrl(), testCase.getData()));
		}
		return instance;
	}
	
	@RequestMapping(produces="application/json", value="/testinstances/{id}/host/{hostid}/curl", method=RequestMethod.GET)
	public @ResponseBody String getTestInstanceCURL(@PathVariable("id") int id, @PathVariable("hostid") int hostid) {
		Host host = dao.getHost(hostid);
		TestCaseInstance ti = getTestCaseInstance(id);
		TestCase tc = getTestCase(ti.getTestCaseId());
		TestCase finaltc = tm.mergeTestValues(tc, ti);
		return String.format(CURL_FORMAT, finaltc.getMethod().name(), finaltc.getData(), host.toUrlFormat() + finaltc.getRestUrl());
	}
	
	
}
