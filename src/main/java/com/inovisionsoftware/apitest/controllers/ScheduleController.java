package com.inovisionsoftware.apitest.controllers;

import java.util.List;

import com.inovisionsoftware.apitest.manager.CronManager;
import com.inovisionsoftware.apitest.manager.ScheduleManager;
import com.inovisionsoftware.apitest.model.NameValue;
import com.inovisionsoftware.apitest.model.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/schedules")
public class ScheduleController {
	
	@Autowired
	private ScheduleManager scheduleManager;
	
	@Autowired
	private CronManager cronManager;

	@RequestMapping(method=RequestMethod.GET)
	public @ResponseBody List<Schedule> getScheduleList() {
		return scheduleManager.getScheduleList();
	}
	
	@RequestMapping(value="/{id}", method=RequestMethod.GET)
	public @ResponseBody Schedule getSchedule(@PathVariable("id") int id) {
		return scheduleManager.getSchedule(id);
	}
	
	@RequestMapping(method=RequestMethod.POST)
	public @ResponseBody Schedule saveSchedule(@RequestBody Schedule schedule) {
		return scheduleManager.saveSchedule(schedule);
	}

	@RequestMapping(value="/{id}", method=RequestMethod.PUT)
	public @ResponseBody Schedule updateSchedule(@RequestBody Schedule schedule) {
		return scheduleManager.saveSchedule(schedule);
	}
	
	@RequestMapping(value="/{id}", method=RequestMethod.DELETE)
	public @ResponseBody Schedule deleteSchedule(@PathVariable("id") int id) {
		return scheduleManager.deleteSchedule(id);
	}
	
	@RequestMapping(value="/cronlist", method=RequestMethod.GET)
	public @ResponseBody List<NameValue> getStandardCronList() {
		return cronManager.getStandardSchedules();
	}
	
	@RequestMapping(value="/scheduler/pause", method=RequestMethod.GET)
	public @ResponseBody String pauseScheduler() {
		return String.valueOf(scheduleManager.pauseScheduler());
	}

	@RequestMapping(value="/scheduler/resume", method=RequestMethod.GET)
	public @ResponseBody String resumeScheduler() {
		return String.valueOf(scheduleManager.resumeScheduler());
	}

	@RequestMapping(value="/scheduler/status", method=RequestMethod.GET)
	public @ResponseBody String getSchedulerStatus() {
		return String.valueOf(scheduleManager.resumeScheduler());
	}
}
