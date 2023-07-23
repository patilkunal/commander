package com.inovisionsoftware.apitest.manager;

import java.util.ArrayList;
import java.util.List;

import org.quartz.CronExpression;
import org.springframework.stereotype.Component;

import com.inovisionsoftware.apitest.exception.CronExpressionException;
import com.inovisionsoftware.apitest.model.CronType;
import com.inovisionsoftware.apitest.model.NameValue;

@Component
public class CronManager {

	private static final String CRON_REGEX = "[0-9,-*/]";
	
	public List<NameValue> getStandardSchedules() {
		List<NameValue> list = new ArrayList<NameValue>();
		for(CronType c : CronType.values()) {
			list.add(new NameValue(c.name(), c.getCronExpression()));
		}
		return list;
	}
	
	public String getCustomHourly(String runAtMin) throws CronExpressionException {		
		return validate(String.format("0 %s * * * ? *", runAtMin));
	}

	public String getCustomDaily(String runAtHour) throws CronExpressionException {
		return validate(String.format("0 0 %s * * ? *", runAtHour));
	}
	
	public String getCustomMonthly(String runAtDays) throws CronExpressionException {
		return validate(String.format("0 0 0 %s * ? *", runAtDays));
	}

	public String getCustom(int min, int hour, int day, int month) throws CronExpressionException {
		return validate(String.format("0 %d %d %d %d ? *", min, hour, day, month));
	}
	
	private String validate(String expr) throws CronExpressionException {
		if(CronExpression.isValidExpression(expr)) {
			return expr;
		} else {
			throw new CronExpressionException();
		}		
	}
}
