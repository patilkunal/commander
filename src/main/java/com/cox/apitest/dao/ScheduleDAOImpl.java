package com.cox.apitest.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.cox.apitest.model.Schedule;

@Repository
public class ScheduleDAOImpl implements ScheduleDAO {

	private static final String GET_SCHEDULES = "select * from schedules";
	private static final String GET_SCHEDULE = "select * from schedules where id = :id";
	private static final String SAVE_SCHEDULE = "insert into schedules(name, cron_expr, active) values (:name, :cronexpr, :active)";
	private static final String UPDATE_SCHEDULE = "update schedules set name = :name, cron_expr = :cronexpr, active = :active where id = :id";
	private static final String DELETE_SCHEDULE = "delete from schedules where id = :id";
	
	private NamedParameterJdbcTemplate jdbcTemplate;
	
	@Autowired
	public void setJdbcTemplate(NamedParameterJdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	@Override
	public List<Schedule> getScheduleList() {		
		return jdbcTemplate.query(GET_SCHEDULES, new ScheduleRowMapper());
	}

	@Override
	public Schedule getSchedule(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", new Integer(id));
		return jdbcTemplate.queryForObject(GET_SCHEDULE, params, new ScheduleRowMapper());
	}

	@Override
	public Schedule saveSchedule(Schedule schedule) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", schedule.getName());
		params.put("cronexpr", schedule.getCronExpression());
		params.put("active", schedule.isActive() ? 1 : 0);			
		if(schedule.getId() > -1) {
			//update
			params.put("id", schedule.getId());
			jdbcTemplate.update(UPDATE_SCHEDULE, params);
		} else {
			//insert new
			KeyHolder keyholder = new GeneratedKeyHolder(); 
			jdbcTemplate.update(SAVE_SCHEDULE, new MapSqlParameterSource(params), keyholder, new String[] {"ID"});
			schedule.setId(keyholder.getKey().intValue());
		}
		return schedule;
	}

	@Override
	public Schedule deleteSchedule(int id) {
		Schedule sch = getSchedule(id);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", new Integer(id));
		jdbcTemplate.update(DELETE_SCHEDULE, params);
		return sch;
	}
	
	private final class ScheduleRowMapper implements RowMapper<Schedule> {

		@Override
		public Schedule mapRow(ResultSet rs, int rowNum) throws SQLException {
			Schedule s = new Schedule();
			s.setId(rs.getInt("ID"));
			s.setActive(rs.getInt("ACTIVE") == 1);
			s.setCronExpression(rs.getString("CRON_EXPR"));
			s.setName(rs.getString("NAME"));
			return s;
		}
		
	}

}
