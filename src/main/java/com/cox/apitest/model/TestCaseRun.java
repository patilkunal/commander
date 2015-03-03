package com.cox.apitest.model;

import java.util.Date;

public class TestCaseRun {

	private int id;
	private int testCaseInstanceId;
	private boolean success;
	private Date runDate;
	private String output;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTestCaseInstanceId() {
		return testCaseInstanceId;
	}
	public void setTestCaseInstanceId(int testCaseInstanceId) {
		this.testCaseInstanceId = testCaseInstanceId;
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
