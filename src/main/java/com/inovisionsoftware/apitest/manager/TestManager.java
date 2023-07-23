package com.inovisionsoftware.apitest.manager;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

import com.inovisionsoftware.apitest.model.TestCaseRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.inovisionsoftware.apitest.dao.TestCaseDAO;
import com.inovisionsoftware.apitest.model.TestCase;
import com.inovisionsoftware.apitest.model.TestCaseInstance;
import com.inovisionsoftware.apitest.model.TestCaseValue;
import com.inovisionsoftware.apitest.model.TestResult;

@Component
public class TestManager {

	@Autowired
	private TestCaseDAO dao;
	
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
	
	public void createTestRun(TestResult result) {
		TestCaseRun run = new TestCaseRun();
		run.setRunDate(new Date());
		run.setSuccess(result.isSuccess());

		//run.setTestCaseInstanceId(result.getTestInstanceId());
		run.setOutput(result.isSuccess()? result.getResult() : result.getError());
		dao.saveTestRun(run);
	}
	
	public TestCaseInstance getTestCaseInstance(int id) {
		return dao.getTestCaseInstance(id);
	}
	
}
