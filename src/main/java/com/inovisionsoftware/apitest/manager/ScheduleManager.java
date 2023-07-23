package com.inovisionsoftware.apitest.manager;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.ee.servlet.QuartzInitializerListener;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletConfigAware;

import com.inovisionsoftware.apitest.dao.ScheduleDAO;
import com.inovisionsoftware.apitest.model.Schedule;
import com.inovisionsoftware.apitest.scheduler.TestCaseRunnerJob;

@Component
public class ScheduleManager implements ServletConfigAware {

	private ScheduleDAO scheduleDao;	
	private ServletConfig servletConfig;
	private Scheduler sch = null;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ScheduleManager.class);
	
	@Autowired
	public void setScheduleDao(ScheduleDAO scheduleDao) {
		this.scheduleDao = scheduleDao;
	}
	
	public List<Schedule> getScheduleList() {
		return scheduleDao.getScheduleList();
	}
	
	public Schedule getSchedule(int id) {
		return scheduleDao.getSchedule(id);
	}
	
	public Schedule saveSchedule(Schedule schedule) {
		//while saving schedule, if it has TestCaseInstances and is active, schedule it
		if(!schedule.isActive()) {
			removeQuartzSchedule(schedule);
		} else if(schedule.isActive()) {
			try {
				createQuartzSchedule(schedule);
			} catch(SchedulerException sce) {
				LOGGER.error("Unable to create quartz job for schedule : " + schedule, sce);
			}
		}
		return scheduleDao.saveSchedule(schedule);
	}
	
	public Schedule deleteSchedule(int id) {
		//to delete schedule, unschedule it from Quartz
		Schedule schedule = getSchedule(id);
		removeQuartzSchedule(schedule);
		return scheduleDao.deleteSchedule(id);
	}
	
	public List<Schedule> getScheduledTestCases() {
		List<Schedule> list = new ArrayList<Schedule>(1);
		try {
			List<JobExecutionContext> jobs = sch.getCurrentlyExecutingJobs();
			for(JobExecutionContext job : jobs) {
//				Schedule schedule = new Schedule();
//				
//				JobDetail jobdetail = job.getJobDetail();
//				JobDataMap datamap = jobdetail.getJobDataMap();
//				List<TestCaseInstance> testinstances = (List<TestCaseInstance>)datamap.get("TESTCASE_INSTANCES");
//				schedule.setTestCaseInstances(testinstances);
//				
//				JobKey jobkey = jobdetail.getKey();
//				schedule.setName(jobkey.getName());
				
				CronTrigger crontrigger = (CronTrigger) job.getTrigger();
				Schedule schedule = (Schedule)crontrigger.getJobDataMap().get("SCHEDULE");
				schedule.setCronExpression(crontrigger.getCronExpression());
				
				list.add(schedule);
			}
		} catch (SchedulerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}
	
	@Override
	public void setServletConfig(ServletConfig servletConfig) {
		this.servletConfig = servletConfig;
		initialize();
	}
	
	//@PostConstruct
	public void initialize() {
		ServletContext ctx = servletConfig.getServletContext();
		StdSchedulerFactory factory = (StdSchedulerFactory) ctx
				                 .getAttribute(QuartzInitializerListener.QUARTZ_FACTORY_KEY);
		try {
			sch = factory.getScheduler("TestCaseScheduler");
		} catch (SchedulerException e) {
			LOGGER.error("Erroring in getting Quartz scheduler object");
		}
		
	}
	
	public boolean pauseScheduler() {
		try {
			sch.standby();
			return true;
		} catch (SchedulerException e) {
			LOGGER.error("Error while pausing scheduler", e);
			return false;
		}
	}
	
	public boolean resumeScheduler() {
		try {
			sch.start();
			return true;
		} catch (SchedulerException e) {
			LOGGER.error("Error while resuming scheduler", e);
			return false;
		}
	}
	
	private void createQuartzSchedule(Schedule schedule) throws SchedulerException {
		TriggerKey triggerKey = new TriggerKey("TRIGGER_" + schedule.getId());
		boolean exists = false;
		try {
			exists = sch.checkExists(triggerKey);
		} catch (SchedulerException e) {
			LOGGER.warn("Check exist trigger query failed! Assuming false.");
		}
		
		if(exists) removeQuartzSchedule(schedule);
		
		JobDataMap trigJobDataMap = new JobDataMap();
		trigJobDataMap.put("SCHEDULE", schedule);
		
		JobDetail jobdetail = JobBuilder.newJob(TestCaseRunnerJob.class)
			//.usingJobData(newJobDataMap)
			.withIdentity("JOB_" + schedule.getId())
			.build();
		
		CronScheduleBuilder csb = CronScheduleBuilder
							.cronSchedule(schedule.getCronExpression())
							.withMisfireHandlingInstructionIgnoreMisfires();
		Trigger trigger = TriggerBuilder.newTrigger()
							.withIdentity(triggerKey)
							.withSchedule(csb)
							.usingJobData(trigJobDataMap)
							.build();
		sch.scheduleJob(jobdetail, trigger);
		
	}
	
	public String getSchedulerStatus() {
		try {
			return String.valueOf(sch.isStarted());
		} catch (SchedulerException e) {
			return "true";
		}
	}
	
	private void removeQuartzSchedule(Schedule schedule) {
		TriggerKey triggerKey = new TriggerKey("TRIGGER_" + schedule.getId());
		boolean exists = false;
		try {
			exists = sch.checkExists(triggerKey);
		} catch (SchedulerException e) {
			LOGGER.warn("Check exist trigger query failed! Assuming false.");
		}
		//delete this trigger
		if(exists) {
			LOGGER.info("Removing existing trigger for " + schedule);
			try {
				sch.unscheduleJob(triggerKey);
			} catch (SchedulerException e) {
				LOGGER.error("Unable to remove schedule for " + schedule, e);
			}
		}
		
	}
	
}
