package com.inovisionsoftware.apitest.manager;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

import com.inovisionsoftware.apitest.model.TestCaseRun;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.inovisionsoftware.apitest.dao.TestCaseDAO;
import com.inovisionsoftware.apitest.model.Host;
import com.inovisionsoftware.apitest.model.TestCase;
import com.inovisionsoftware.apitest.model.TestCaseInstance;
import com.inovisionsoftware.apitest.model.TestCaseValue;
import com.inovisionsoftware.apitest.model.TestResult;
import com.inovisionsoftware.apitest.util.RestHttpClient;

@Component
public class TestRunManager {

	private static final Logger logger = LoggerFactory.getLogger(TestRunManager.class);
			
	@Autowired
	private TestCaseDAO dao;
	
	@Autowired
	private RestHttpClient restClient;
	
	public TestCase mergeTestValues(TestCase tc, TestCaseInstance tci) {
		String finalUrl = mergeUrlValues(tc.getRestUrl(), tci.getTestCaseValues());
		tc.setRestUrl(finalUrl);
		tc.setData(mergeDataValues(tc.getData(), tci.getTestCaseValues()));
		return tc;
	}
	
	private String mergeUrlValues(String template, List<TestCaseValue> values) {
		String mergeString = template;
		if((values != null) && (values.size() > 0)) {
			for(TestCaseValue tcv : values) {
				String name = tcv.getName();
				String replacestr = null;
				if(tcv.isRequired()) {
					replacestr = String.format("#%s#", name);
				} else {
					replacestr = String.format("#?%s#", name);
				}
				String value = null;
				try {
					value = java.net.URLEncoder.encode(tcv.getValue(), "ISO-8859-1");
				} catch(UnsupportedEncodingException e) {};
				mergeString = mergeString.replaceAll(replacestr, value);
			}
		}
		return mergeString;
	}
	
	private String mergeDataValues(String template, List<TestCaseValue> values) {
		String mergeString = template;
		if((template != null) && (values != null) && (values.size() > 0)) {
			for(TestCaseValue tcv : values) {
				String name = tcv.getName();
				String replacestr = null;
				if(tcv.isRequired()) {
					replacestr = String.format("#%s#", name);
				} else {
					replacestr = String.format("#?%s#", name);
				}
				mergeString = mergeString.replaceAll(replacestr, tcv.getValue());
			}
		}
		return mergeString;
	}
	
	public void saveTestRunResult(TestResult result) {
		TestCaseRun run = new TestCaseRun();
		run.setRunDate(new Date());
		run.setSuccess(result.isSuccess());
		run.setTestCaseInstance(new TestCaseInstance(result.getTestInstanceId()));
		run.setHostId(result.getHostId());
		run.setOutput(result.isSuccess()? result.getResult() : result.getError());
		dao.saveTestRun(run);
	}
	
	public TestCaseInstance getTestCaseInstance(int id) {
		return dao.getTestCaseInstance(id);
	}
	
	public TestResult executeTest(int testInstanceId, int hostid) throws Exception {
		Host host = dao.getHost(hostid); 
		TestCaseInstance tci = dao.getTestCaseInstance(testInstanceId);
		TestCase tc = dao.getTestCase(tci.getTestCaseId());
		TestCase runTestCase = mergeTestValues(tc, tci);
		TestResult result = restClient.doHttpRequest(runTestCase, host);
		result.setTestInstanceId(tci.getId());
		result.setHostId(hostid);
		saveTestRunResult(result);
		return result;
	}
	
	public TestResult executeTest(int hostid, TestCase testCase) throws Exception {
		Host host = dao.getHost(hostid); 
		logger.info("Executing test : " + testCase + " on host " + host);
		return restClient.doHttpRequest(testCase, host);
	}
	
}
