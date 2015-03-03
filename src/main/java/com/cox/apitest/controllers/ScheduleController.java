package com.cox.apitest.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cox.apitest.manager.ScheduleManager;
import com.cox.apitest.model.Schedule;

@Controller
public class ScheduleController {
	
	@Autowired
	private ScheduleManager scheduleManager;

	@RequestMapping(value="/schedules", method=RequestMethod.GET)
	public @ResponseBody List<Schedule> getScheduleList() {
		return scheduleManager.getScheduleList();
	}
	
	@RequestMapping(value="/schedules/{id}", method=RequestMethod.GET)
	public @ResponseBody Schedule getSchedule(@PathVariable("id") int id) {
		return scheduleManager.getSchedule(id);
	}
	
	@RequestMapping(value="/schedules", method=RequestMethod.POST)
	public @ResponseBody Schedule saveSchedule(@RequestBody Schedule schedule) {
		return scheduleManager.saveSchedule(schedule);
	}

	@RequestMapping(value="/schedules/{id}", method=RequestMethod.PUT)
	public @ResponseBody Schedule updateSchedule(@RequestBody Schedule schedule) {
		return scheduleManager.saveSchedule(schedule);
	}
	
	@RequestMapping(value="/schedules/{id}", method=RequestMethod.DELETE)
	public @ResponseBody Schedule deleteSchedule(@PathVariable("id") int id) {
		return scheduleManager.deleteSchedule(id);
	}
}
