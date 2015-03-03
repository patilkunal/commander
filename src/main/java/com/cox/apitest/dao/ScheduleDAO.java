package com.cox.apitest.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.cox.apitest.model.Schedule;

public interface ScheduleDAO {

	public List<Schedule> getScheduleList();
	public Schedule getSchedule(int id);
	public Schedule saveSchedule(Schedule schedule);
	public Schedule deleteSchedule(int id);
	
}
