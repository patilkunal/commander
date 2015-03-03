package com.cox.apitest.model;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class Schedule {

	private int id = -1;
	private String name;
	private String cronExpression;
	private boolean active;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCronExpression() {
		return cronExpression;
	}
	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean active) {
		this.active = active;
	}
	
	@Override
	public boolean equals(Object obj) {
		return (obj != null) ? this.id == ((Schedule)obj).id : false;
	}
	
	@Override
	public int hashCode() {
		return 37 * id;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
