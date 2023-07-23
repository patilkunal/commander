package com.inovisionsoftware.apitest.dao;

import java.util.List;

import com.inovisionsoftware.apitest.model.Host;
import com.inovisionsoftware.apitest.model.TestCase;
import com.inovisionsoftware.apitest.model.TestCaseCategory;
import com.inovisionsoftware.apitest.model.TestCaseInstance;
import com.inovisionsoftware.apitest.model.TestCaseRun;
import com.inovisionsoftware.apitest.model.TestCaseRunFilter;
import com.inovisionsoftware.apitest.model.TestCaseValue;

public interface TestCaseDAO {

	public List<TestCaseCategory> getTestCategories();
	public TestCaseCategory getTestCategory(int id);
	public void deleteTestCategory(int id);
	public TestCaseCategory saveTestCategory(TestCaseCategory tc);
	
	public List<TestCaseInstance> getTestCaseInstances(int categoryId);
	public TestCaseInstance getTestCaseInstance(int id);
	public TestCaseInstance saveTestCaseInstance(TestCaseInstance ti);
	public void deleteTestCaseInstance(int id);

	public List<TestCase> getTestCases(int categoryId);
	public TestCase getTestCase(int id);
	public TestCase saveTestCase(TestCase testCase);
	public void deleteTestCase(int id);

	public List<TestCaseRun> getTestCaseRuns(TestCaseRunFilter filter);

	public List<Host> getHosts();
	public List<Host> getHosts(int testCategoryId);
	public Host getHost(int id);
	public Host saveHost(Host host);
	public void deleteHost(int id);
	
	public List<TestCaseValue> getTestCaseValues(int testCaseInstanceId);
	
	public TestCaseRun saveTestRun(TestCaseRun run);
	public List<TestCaseRun> getTestRunList();
	public TestCaseRun getTestRun(int id);
}
