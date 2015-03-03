package com.cox.apitest.model;

import java.util.List;

public class TestCaseInstance {

	private int id = -1;
	private int testCaseId;
	private String name;
	private String description;
	
	private List<TestCaseValue> testCaseValues;

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
