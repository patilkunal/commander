package com.cox.apitest.model;

public class Host {
	
	private int id;
	private int testCategoryId;
	private String hostname;
	private int port;
	private String name;
	private boolean secureHttp;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTestCategoryId() {
		return testCategoryId;
	}
	public void setTestCategoryId(int testCategoryId) {
		this.testCategoryId = testCategoryId;
	}
	public String getHostname() {
		return hostname;
	}
	public void setHostname(String hostname) {
		this.hostname = hostname;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public boolean isSecureHttp() {
		return secureHttp;
	}
	public void setSecureHttp(boolean secureHttp) {
		this.secureHttp = secureHttp;
	}
	
	@Override
	public String toString() {		
		return String.format("Host[hostname: %1$s] [port: %2$d] [name: %3$s]]", hostname, port, name);
	}

	public String toUrlFormat() {		
		return String.format("%s://%s:%d", secureHttp ? "https" : "http", hostname, port);
	}
	
}
