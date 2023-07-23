package com.inovisionsoftware.apitest.scheduler;

import com.inovisionsoftware.apitest.model.Schedule;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestCaseRunnerJob implements Job {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(TestCaseRunnerJob.class);

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		// TODO Auto-generated method stub
		JobDataMap jobdata = context.getTrigger().getJobDataMap();
		Schedule schedule = (Schedule) jobdata.get("SCHEDULE");
		
		LOGGER.info("Going to run following schedule : " + schedule);
	}

}
