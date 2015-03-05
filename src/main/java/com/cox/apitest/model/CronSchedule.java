package com.cox.apitest.model;

public class CronSchedule {

	private String cronExpression;
	private String customTemplate;
	private Parameter[] parameters;
	
	public String getCronExpression() {
		return cronExpression;
	}
	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}
	public String getCustomTemplate() {
		return customTemplate;
	}
	public void setCustomTemplate(String customTemplate) {
		this.customTemplate = customTemplate;
	}
	public Parameter[] getParameters() {
		return parameters;
	}
	public void setParameters(Parameter[] parameters) {
		this.parameters = parameters;
	}
	
	
}
