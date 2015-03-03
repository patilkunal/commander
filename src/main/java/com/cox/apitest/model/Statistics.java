package com.cox.apitest.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="statistics")
public class Statistics {
	
	private String category;
	private String name;
	private int success;
	private int failures;
	
	public Statistics() {
		
	}
	
	public Statistics(String category, String name, int success, int failures) {
		this.category = category;
		this.name = name;
		this.success = success;
		this.failures = failures;
	}
	
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getSuccess() {
		return success;
	}
	public void setSuccess(int success) {
		this.success = success;
	}
	public int getFailures() {
		return failures;
	}
	public void setFailures(int failures) {
		this.failures = failures;
	}
	
	@Override
	public boolean equals(Object obj) {
		if((obj == null) || !(obj instanceof Statistics)) {
			return false;
		} else {
			Statistics other = (Statistics) obj;
			return (this.category != null) && (this.category.equals(other.category))
					&& (this.name != null) && (this.name.equals(other.name));
		}
	}
	
	@Override
	public int hashCode() {		
		return ((this.category != null) ? this.category.hashCode() : 31)
				+ ((this.name != null) ? this.name.hashCode() : 37);
	}
	
}
