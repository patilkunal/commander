package com.inovisionsoftware.apitest.dao;

import java.util.List;

import com.inovisionsoftware.apitest.model.Schedule;

public interface ScheduleDAO {

	public List<Schedule> getScheduleList();
	public Schedule getSchedule(int id);
	public Schedule saveSchedule(Schedule schedule);
	public Schedule deleteSchedule(int id);
	
}
