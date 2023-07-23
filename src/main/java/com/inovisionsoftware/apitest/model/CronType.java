package com.inovisionsoftware.apitest.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.inovisionsoftware.apitest.util.CronFormatter;

@JsonPropertyOrder(value="cronExpression")
public enum CronType {

	//SEC MIN HOUR DAY MON DAYOFWEEK YEAR  
	HOURLY("0 0 * * * ? *", "Every Hour", new CronFormatter() {
		@Override
		public String format(String cronExpression, Parameter[] params) {
			int minute = 0;
			for(Parameter p : params) {
				if("Minute".equals(p.getName())) {
					minute = p.getValue();
				}
			}
			return String.format("0 %d * * * ? *", minute);
		}
		
		@Override
		public Parameter[] getParameters() {
			Parameter p = new Parameter("Hour", 0, 11, 0);
			Parameter p2 = new Parameter("Minute", 0, 59, 0);
			
			return new Parameter[]{p, p2};
		}
	}),
	DAILY("0 0 0 * * ? *", "Daily", new CronFormatter() {
		@Override
		public String format(String cronExpression, Parameter[] params) {
			int hour = 0;
			int minute = 0;
			for(Parameter p : params) {
				if("Hour".equals(p.getName())) {
					hour = p.getValue();
				} else if("Minute".equals(p.getName())) {
					minute = p.getValue();
				}
			}
			return String.format("0 %d %d * * ? *", minute, hour );
		}
		
		@Override
		public Parameter[] getParameters() {
			Parameter p = new Parameter("Hour", 0, 11, 0);
			Parameter p2 = new Parameter("Minute", 0, 59, 0);
			
			return new Parameter[]{p, p2};
		}
	}),
	MONTHLY("0 0 0 0 * ? *", "Start of month at mid-night", new CronFormatter() {
		@Override
		public String format(String cronExpression, Parameter[] params) {
			// TODO Auto-generated method stub
			return null;
		}
		
		@Override
		public Parameter[] getParameters() {
			Parameter p = new Parameter("Hour", 0, 11, 0);
			Parameter p2 = new Parameter("Minute", 0, 59, 0);
			Parameter p3 = new Parameter("Day", 0, 30, 10);
			return new Parameter[]{p, p2, p3};
		}
	}),
	YEARLY("0 0 0 0 0 ? *", "Start of year at mid-night", new CronFormatter() {
		@Override
		public String format(String cronExpression, Parameter[] params) {
			// TODO Auto-generated method stub
			return null;
		}
		@Override
		public Parameter[] getParameters() {
			Parameter p = new Parameter("Hour", 0, 11, 0);
			Parameter p2 = new Parameter("Minute", 0, 59, 0);
			Parameter p3 = new Parameter("Day", 0, 30, 0);
			Parameter p4 = new Parameter("Month", 0, 11, 0);
			return new Parameter[]{p, p2, p3, p4};
		}
	});
	
	
	private String cronExpression;
	private String description;
	private CronFormatter formatter;
	
	CronType(String cronExpression, String description, CronFormatter formatter) {
		this.cronExpression = cronExpression;
		this.description = description;
		this.formatter = formatter;
	}
	
	public String getCronExpression() {
		return cronExpression;
	}
	
	public String getDescription() {
		return description;
	}
	
	public CronFormatter getFormatter() {
		return formatter;
	}
}
