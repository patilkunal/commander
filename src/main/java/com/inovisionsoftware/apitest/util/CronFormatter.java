package com.inovisionsoftware.apitest.util;

import com.inovisionsoftware.apitest.model.Parameter;

public interface CronFormatter {

	public String format(String cronExpression, Parameter[] params);
	public Parameter[] getParameters();
}
