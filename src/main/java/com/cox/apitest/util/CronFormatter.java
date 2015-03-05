package com.cox.apitest.util;

import com.cox.apitest.model.Parameter;

public interface CronFormatter {

	public String format(String cronExpression, Parameter[] params);
	public Parameter[] getParameters();
}
