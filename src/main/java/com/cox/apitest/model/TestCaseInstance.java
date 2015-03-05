package com.cox.apitest.model;

import java.util.List;

public class TestCaseInstance {

	private int id = -1;
	private int testCaseId;
	private int userId;
	private String name;
	private String description;
	
	private List<TestCaseValue> testCaseValues;

	public TestCaseInstance() {};
	public TestCaseInstance(int id) {
		this.id = id;
	}
	public TestCaseInstance(int id, int testCaseId, String name, String desc) {
		this.id = id;
		this.testCaseId = testCaseId;
		this.name = name;
		this.description = desc;
	}
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getTestCaseId() {
		return testCaseId;
	}

	public void setTestCaseId(int testCaseId) {
		this.testCaseId = testCaseId;
	}
	
	public int getUserId() {
		return userId;
	}
	
	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<TestCaseValue> getTestCaseValues() {
		return testCaseValues;
	}

	public void setTestCaseValues(List<TestCaseValue> testCaseValues) {
		this.testCaseValues = testCaseValues;
	}
	
	@Override
	public boolean equals(Object obj) {
		if((obj == null) || !(obj instanceof TestCaseInstance)) {
			return false;
		} else {
			TestCaseInstance other = (TestCaseInstance) obj;
			return this.id == other.id;
		}
	}
	
	@Override
	public int hashCode() {
		return 37 * id;
	}
	
}
