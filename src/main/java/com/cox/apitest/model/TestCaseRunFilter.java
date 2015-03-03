package com.cox.apitest.model;

import java.util.Date;

public class TestCaseRunFilter {

	private int testCaseInstanceId = -1;
	private int testCaseCategoryId = -1;
	private Date startRunDate;
	private Date endRunDate;
	private int historyCount;
	
	public int getTestCaseInstanceId() {
		return testCaseInstanceId;
	}
	public void setTestCaseInstanceId(int testCaseInstanceId) {
		this.testCaseInstanceId = testCaseInstanceId;
	}
	public Date getStartRunDate() {
		return startRunDate;
	}
	public void setStartRunDate(Date startRunDate) {
		this.startRunDate = startRunDate;
	}
	public Date getEndRunDate() {
		return endRunDate;
	}
	public void setEndRunDate(Date endRunDate) {
		this.endRunDate = endRunDate;
	}
	public void setTestCaseCategoryId(int testCaseCategoryId) {
		this.testCaseCategoryId = testCaseCategoryId;
	}
	public int getTestCaseCategoryId() {
		return testCaseCategoryId;
	}
	
	public int getHistoryCount() {
		return historyCount;
	}
	public void setHistoryCount(int historyCount) {
		this.historyCount = historyCount;
	}
	
}
