package com.inovisionsoftware.apitest.model;

public class TestCaseValue {

	private int id;
	private int testCaseInstanceId = -1;
	private String name;
	private String value;
	private boolean required;
	
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public boolean isRequired() {
		return required;
	}
	public void setRequired(boolean required) {
		this.required = required;
	}
	
}
