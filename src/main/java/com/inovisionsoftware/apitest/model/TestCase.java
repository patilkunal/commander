package com.inovisionsoftware.apitest.model;

import org.springframework.http.HttpMethod;

public class TestCase {

	private int id;
	private int testCategoryId;
	private String name;
	private String description;
	private String restUrl;	
	private HttpMethod method = HttpMethod.GET;
	private String data;
	
	private int instances;
	
	public int getId() {
		return id;
	}	
	public void setId(int id) {
		this.id = id;
	}
	public String getRestUrl() {
		return restUrl;
	}
	public void setRestUrl(String restUrl) {
		this.restUrl = restUrl;
	}
	public int getTestCategoryId() {
		return testCategoryId;
	}
	public void setTestCategoryId(int testCategoryId) {
		this.testCategoryId = testCategoryId;
	}
	public HttpMethod getMethod() {
		return method;
	}
	public void setMethod(HttpMethod method) {
		this.method = method;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
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
	public int getInstances() {
		return instances;
	}
	public void setInstances(int instances) {
		this.instances = instances;
	}
	
	@Override
	public String toString() {
		return String.format("TestCase [name: %1$s] [RestURL: %2$s] [Data: %3$s] [Method: %4$s]]", name, restUrl, data, method.name());
	}
}
