package com.cox.apitest.manager;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cox.apitest.dao.ScheduleDAO;
import com.cox.apitest.model.Schedule;

@Component
public class ScheduleManager {

	private ScheduleDAO scheduleDao;
	
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
		return scheduleDao.saveSchedule(schedule);
	}
	
	public Schedule deleteSchedule(int id) {
		return scheduleDao.deleteSchedule(id);
	}
	
	
}
