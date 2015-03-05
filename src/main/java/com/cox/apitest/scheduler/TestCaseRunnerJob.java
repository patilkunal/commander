package com.cox.apitest.scheduler;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.cox.apitest.model.Schedule;

public class TestCaseRunnerJob implements Job {
	
	private static final Logger LOGGER = Logger.getLogger(TestCaseRunnerJob.class);

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		// TODO Auto-generated method stub
		JobDataMap jobdata = context.getTrigger().getJobDataMap();
		Schedule schedule = (Schedule) jobdata.get("SCHEDULE");
		
		LOGGER.info("Going to run following schedule : " + schedule);
	}

}
