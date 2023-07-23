package com.inovisionsoftware.apitest.model;

import java.util.Date;

public class TestCaseRun {

	private int id;
	private TestCaseInstance testCaseInstance;
	private int hostId;
	private boolean success;
	private Date runDate;
	private String output;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public TestCaseInstance getTestCaseInstance() {
		return testCaseInstance;
	}
	public void setTestCaseInstance(TestCaseInstance testCaseInstance) {
		this.testCaseInstance = testCaseInstance;
	}
	public int getHostId() {
		return hostId;
	}
	public void setHostId(int hostId) {
		this.hostId = hostId;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public Date getRunDate() {
		return runDate;
	}
	public void setRunDate(Date runDate) {
		this.runDate = runDate;
	}
	public String getOutput() {
		return output;
	}
	public void setOutput(String output) {
		this.output = output;
	}
	
	
}
