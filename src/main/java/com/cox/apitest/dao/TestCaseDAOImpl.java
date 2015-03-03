package com.cox.apitest.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.cox.apitest.model.Host;
import com.cox.apitest.model.TestCase;
import com.cox.apitest.model.TestCaseCategory;
import com.cox.apitest.model.TestCaseInstance;
import com.cox.apitest.model.TestCaseRun;
import com.cox.apitest.model.TestCaseRunFilter;
import com.cox.apitest.model.TestCaseValue;

@Repository
public class TestCaseDAOImpl implements TestCaseDAO {
	
	private static final Logger logger = Logger.getLogger(TestCaseDAOImpl.class);
	
	private static final String GET_CATEGORIES = "select * from TEST_CATEGORY";
	private static final String GET_CATEGORY = "select * from TEST_CATEGORY where id = :id";
	private static final String DELETE_CATEGORY = "delete from TEST_CATEGORY where id = :id";
	private static final String SAVE_CATEGORY = "insert into TEST_CATEGORY(name, description) values(:name, :description)";
	private static final String UPDATE_CATEGORY = "update TEST_CATEGORY set name = :name, description = :description where id = :id";
	
	private static final String GET_TESTCASES = "select t.*, count(ti.id) INSTANCES from TESTCASE t LEFT OUTER JOIN TESTCASE_INSTANCE ti ON t.id = ti.TESTCASE_ID where t.TEST_CATEGORY_ID = :categoryId GROUP by t.id";
	private static final String GET_TESTCASE = "select t.*, count(ti.id) INSTANCES from TESTCASE t LEFT OUTER JOIN TESTCASE_INSTANCE ti ON t.id = ti.TESTCASE_ID where t.id = :id GROUP BY t.id";
	private static final String SAVE_TESTCASE = "insert into TESTCASE(NAME, DESCRIPTION, TEST_CATEGORY_ID, REST_URL, HTTP_METHOD, HTTP_DATA) "
			+ " values(:name, :description, :testCategoryId, :restUrl, :method, :data)";
	private static final String UPDATE_TESTCASE = "update TESTCASE set NAME = :name, DESCRIPTION = :description, TEST_CATEGORY_ID = :testCategoryId, REST_URL = :restUrl, "
			+ "HTTP_METHOD = :method, HTTP_DATA = :data where id = :id ";
	private static final String DELETE_TESTCASE = "delete from TESTCASE where id = :id";
	
	
	private static final String GET_TESTCASEINSTANCES = "select ti.* from TESTCASE_INSTANCE ti, TESTCASE tc where tc.id = ti.TESTCASE_ID and tc.TEST_CATEGORY_ID = :categoryId";
	private static final String GET_TESTCASEINSTANCE = "select ti.* from TESTCASE_INSTANCE ti where id = :id";
	private static final String SAVE_TESTCASE_INSTANCE = "insert into TESTCASE_INSTANCE(NAME, DESCRIPTION, TESTCASE_ID) "
			+ " values(:name, :description, :testCaseId)";
	private static final String UPDATE_TESTCASE_INSTANCE = "update TESTCASE_INSTANCE set NAME = :name, DESCRIPTION = :description "
			+ " where id = :id ";
	private static final String DELETE_TESTCASE_INSTANCE = "delete from TESTCASE_INSTANCE where id = :id";

	private static final String GET_TESTRUNS = "select tr.id, tr.success, tr.run_date, tr.run_output, ti.id TESTCASE_INSTANCE_ID, ti.name, ti.description, cat.name CATEGORY "
			+ " from TESTCASE_RUN tr"
			+ " right outer join TESTCASE_INSTANCE ti  on ti.id =  tr.TESTCASE_INSTANCE_ID"
			+ " inner join TESTCASE tc on  ti.TESTCASE_ID = tc.id"
			+ " inner join TEST_CATEGORY cat on tc.TEST_CATEGORY_ID = cat.id ";
	
	private static final String GET_HOST_BY_ID = "select * from hosts where id = :id";
	private static final String GET_HOSTS = "select * from hosts order by id ";
	private static final String GET_HOSTS_BY_CATEGORY = "select * from hosts where test_category_id = :testCategoryId order by id ";
	private static final String SAVE_HOST = "insert into HOSTS(HOSTNAME, TEST_CATEGORY_ID, PORT, NAME, SECUREHTTP ) "
			+ " values(:hostname, :testCategoryId, :port, :name, :securehttp)";
	private static final String UPDATE_HOST = "update HOSTS set HOSTNAME = :hostname, TEST_CATEGORY_ID = :testCategoryId, PORT = :port, NAME = :name, SECUREHTTP = :securehttp "
			+ " where id = :id ";
	private static final String DELETE_HOST = "delete from hosts where id = :id";

	private static final String GET_TESTCASE_VALUES = "select tv.* from TESTCASE_VALUES tv where tv.TESTCASE_INSTANCE_ID = :testCaseInstanceId";
	private static final String SAVE_TESTCASE_VALUES = "insert into TESTCASE_VALUES(TESTCASE_INSTANCE_ID, KEY_NAME, KEY_VALUE) "
			+ " values(:testCaseInstanceId, :keyname, :keyvalue)";
	private static final String DELETE_TESTCASE_VALUES = "delete from TESTCASE_VALUES where TESTCASE_INSTANCE_ID = :testCaseInstanceId";
	
	private static final String SAVE_TEST_CASE_RUN = "insert into TESTCASE_RUN(TESTCASE_INSTANCE_ID, SUCCESS, RUN_DATE, RUN_OUTPUT) "
			+ " values(:testCaseInstanceId, :success, :runDate, :output)";
	
	private static final String GET_TEST_CASE_RUN_LIST = "select * from TESTCASE_RUN";

	private static final String GET_TEST_CASE_RUN_LIST_BY_CATEGORY = "select tc.name, tr.* from testcase_run tr, testcase_instance ti, testcase t, test_category tc"
														+ "where tr.testcase_instance_id = ti.id"
														+ "and ti.testcase_id = t.id"
														+ "and t.test_category_id = tc.id"
														+ "and tc.id = :testCategoryId;";
	
	private static final String GET_TEST_CASE_RUN_BY_ID = GET_TEST_CASE_RUN_LIST + " where id = :id"; 
	
	private NamedParameterJdbcTemplate jdbcTemplate;
	
	@Autowired
	public void setJbdcTemplate(NamedParameterJdbcTemplate jbdcTemplate) {
		this.jdbcTemplate = jbdcTemplate;
	}
	
	public List<TestCaseCategory> getTestCategories() {
		return jdbcTemplate.query(GET_CATEGORIES, new TestCaseCategoryRowMapper());		
	}
	
	public TestCaseCategory getTestCategory(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		return jdbcTemplate.queryForObject(GET_CATEGORY, params, new TestCaseCategoryRowMapper());
	}
	
	public void deleteTestCategory(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		jdbcTemplate.update(DELETE_CATEGORY, params);
	}
	
	public TestCaseCategory saveTestCategory(TestCaseCategory tc) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", tc.getName());
		params.put("description", tc.getDescription());
		if(tc.getId() > -1) {
			params.put("id", tc.getId());
			jdbcTemplate.update(UPDATE_CATEGORY, params);
		} else {
			KeyHolder keyholder = new GeneratedKeyHolder(); 
			jdbcTemplate.update(SAVE_CATEGORY, new MapSqlParameterSource(params), keyholder, new String[] {"ID"});
			tc.setId(keyholder.getKey().intValue());
		}
		return tc;
	}

	public List<TestCase> getTestCases(int categoryId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("categoryId", categoryId);
		
		return jdbcTemplate.query(GET_TESTCASES, params, new TestCaseRowMapper());
	}

	public TestCase getTestCase(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		return jdbcTemplate.queryForObject(GET_TESTCASE, params, new TestCaseRowMapper());
	}
	
	public TestCase saveTestCase(TestCase testCase) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", testCase.getName());
		params.put("description", testCase.getDescription());
		params.put("restUrl", testCase.getRestUrl());
		params.put("data", testCase.getData());
		params.put("method", testCase.getMethod().name());
		params.put("testCategoryId", testCase.getTestCategoryId());
		
		if(testCase.getId() > -1) {
			//update 
			params.put("id", testCase.getId());
			jdbcTemplate.update(UPDATE_TESTCASE, params);
		} else {
			//save
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(SAVE_TESTCASE, new MapSqlParameterSource(params), keyHolder, new String[] {"ID"});
			testCase.setId(keyHolder.getKey().intValue());
		}
		return testCase;
	}
	
	public void deleteTestCase(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		jdbcTemplate.update(DELETE_TESTCASE, params);
	}

	public List<TestCaseInstance> getTestCaseInstances(int categoryId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("categoryId", categoryId);
		
		List<TestCaseInstance> list = jdbcTemplate.query(GET_TESTCASEINSTANCES, params, new TestCaseInstanceRowMapper());
		for(TestCaseInstance ti : list) {
			ti.setTestCaseValues(getTestCaseValues(ti.getId()));
		}
		return list;
	}
	
	public TestCaseInstance getTestCaseInstance(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		
		List<TestCaseInstance> list = jdbcTemplate.query(GET_TESTCASEINSTANCE, params, new TestCaseInstanceRowMapper());
		if(list.size() > 0) {
			TestCaseInstance ti = list.get(0);
			ti.setTestCaseValues(getTestCaseValues(ti.getId()));
			return ti;
		} else {
			return null;
		}
	}
	
	public List<TestCaseValue> getTestCaseValues(int testCaseInstanceId) {
		Map<String, Object> params2 = new HashMap<String, Object>();
		params2.put("testCaseInstanceId", testCaseInstanceId);			
		return jdbcTemplate.query(GET_TESTCASE_VALUES, params2, new TestCaseValueRowMapper());
	}
	
	public TestCaseInstance saveTestCaseInstance(TestCaseInstance ti) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("name", ti.getName());
		params.put("description", ti.getDescription());
		params.put("testCaseId", ti.getTestCaseId());
		
		if(ti.getId() > -1) {
			params.put("id", ti.getId());
			jdbcTemplate.update(UPDATE_TESTCASE_INSTANCE, params);
		} else {
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(SAVE_TESTCASE_INSTANCE, new MapSqlParameterSource(params), keyHolder, new String[] {"ID"});
			ti.setId(keyHolder.getKey().intValue());			
		}
		
		if(ti.getTestCaseValues() != null) {
			params.put("testCaseInstanceId", ti.getId());
			jdbcTemplate.update(DELETE_TESTCASE_VALUES, params);
			for(TestCaseValue tcv : ti.getTestCaseValues()) {
				params.put("keyname", tcv.getName());
				params.put("keyvalue", tcv.getValue());
				jdbcTemplate.update(SAVE_TESTCASE_VALUES, params);
			}
		}
		return ti;
	}
	
	public void deleteTestCaseInstance(int id) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("id", id);
		jdbcTemplate.update(DELETE_TESTCASE_INSTANCE, paramMap);
	}

	public List<TestCaseRun> getTestCaseRuns(TestCaseRunFilter filter) {
		StringBuilder sql = new StringBuilder(GET_TESTRUNS);
		Map<String, Object> params = new HashMap<String, Object>();
		if(filter.getTestCaseCategoryId() > -1) {
			sql.append(" and cat.id = :categoryId");
			params.put("categoryId", filter.getTestCaseCategoryId());
		}
		if(filter.getTestCaseInstanceId() > -1) {
			sql.append(" and tc.id = :testCaseInstanceId");
			params.put("testCaseInstanceId", filter.getTestCaseInstanceId());
		}
		if((filter.getStartRunDate() != null) && (filter.getEndRunDate() != null)) {
			sql.append(" and tr.run_date between :startDate and :endDate");
			params.put("startDate", filter.getStartRunDate());
			params.put("endDate", filter.getEndRunDate());
		}
		return jdbcTemplate.query(sql.toString(), params, new TestCaseRunRowMapper());
	}
	
	public List<Host> getHosts() {
		return jdbcTemplate.query(GET_HOSTS, new HostRowMapper());
	}

	public List<Host> getHosts(int testCategoryId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("testCategoryId", testCategoryId);
		return jdbcTemplate.query(GET_HOSTS_BY_CATEGORY, params, new HostRowMapper());
	}
	
	public Host getHost(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);
		List<Host> list = jdbcTemplate.query(GET_HOST_BY_ID, params, new HostRowMapper());
		if(list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	
	public Host saveHost(Host host) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("hostname", host.getHostname());
		params.put("testCategoryId", host.getTestCategoryId());
		params.put("port", host.getPort());
		params.put("name", host.getName());
		params.put("securehttp", host.isSecureHttp() ? 1 : 0);
		if(host.getId() > -1) {
			params.put("id", host.getId());
			logger.debug("Updating " + host);
			jdbcTemplate.update(UPDATE_HOST, params);			
		} else {
			logger.debug("Saving " + host);
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(SAVE_HOST, new MapSqlParameterSource(params), keyHolder, new String[] {"ID"});
			host.setId(keyHolder.getKey().intValue());			
		}
		return host;
	}
	
	public void deleteHost(int id) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("id", id);
		jdbcTemplate.update(DELETE_HOST, paramMap);		
	}
	
	public TestCaseRun saveTestRun(TestCaseRun run) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("testCaseInstanceId", run.getTestCaseInstanceId());
		params.put("success", run.isSuccess() ? 1 : 0);
		params.put("runDate", run.getRunDate());
		params.put("output", run.getOutput());
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(SAVE_TEST_CASE_RUN, new MapSqlParameterSource(params), keyHolder, new String[] {"ID"});
		run.setId(keyHolder.getKey().intValue());
		return run;
	}
	
	public TestCaseRun getTestRun(int id) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("id", id);		
		return jdbcTemplate.queryForObject(GET_TEST_CASE_RUN_BY_ID, params, TestCaseRun.class);
	}
	
	public List<TestCaseRun> getTestRunList() {		
		return jdbcTemplate.query(GET_TESTRUNS, new TestCaseRunMapper());
	}
	
	private final class TestCaseCategoryRowMapper implements RowMapper<TestCaseCategory> {

		public TestCaseCategory mapRow(ResultSet rs, int arg1) throws SQLException {
			TestCaseCategory category = new TestCaseCategory();
			category.setId(rs.getInt("ID"));
			category.setDescription(rs.getString("description"));
			category.setName(rs.getString("name"));
			return category;
		}
		
	}
	
	private final class TestCaseRowMapper implements RowMapper<TestCase> {
		
		public TestCase mapRow(ResultSet rs, int arg1) throws SQLException {
			TestCase t = new TestCase();
			t.setId(rs.getInt("ID"));
			t.setTestCategoryId(rs.getInt("TEST_CATEGORY_ID"));
			t.setName(rs.getString("name"));
			t.setDescription(rs.getString("description"));
			t.setRestUrl(rs.getString("REST_URL"));
			t.setData(rs.getString("http_data"));
			t.setMethod(HttpMethod.valueOf(rs.getString("http_method")));
			t.setInstances(rs.getInt("INSTANCES"));
			return t;
		}
	}

	private final class TestCaseInstanceRowMapper implements RowMapper<TestCaseInstance> {
		
		public TestCaseInstance mapRow(ResultSet rs, int arg1) throws SQLException {
			TestCaseInstance t = new TestCaseInstance();
			t.setId(rs.getInt("ID"));
			t.setTestCaseId(rs.getInt("TESTCASE_ID"));
			t.setName(rs.getString("name"));
			t.setDescription(rs.getString("description"));
			return t;
		}
	}

	private final class TestCaseRunRowMapper implements RowMapper<TestCaseRun> {
		
		public TestCaseRun mapRow(ResultSet rs, int arg1) throws SQLException {
			TestCaseRun t = new TestCaseRun();
			t.setId(rs.getInt("ID"));
			t.setTestCaseInstanceId(rs.getInt("TESTCASE_INSTANCE_ID"));
			t.setRunDate(rs.getDate("RUN_DATE"));
			t.setOutput(rs.getString("RUN_OUTPUT"));
			return t;
		}
	}
	
	private final class TestCaseValueRowMapper implements RowMapper<TestCaseValue> {
		
		public TestCaseValue mapRow(ResultSet rs, int arg1) throws SQLException {
			TestCaseValue t = new TestCaseValue();
			t.setId(rs.getInt("ID"));
			t.setTestCaseInstanceId(rs.getInt("TESTCASE_INSTANCE_ID"));
			t.setName(rs.getString("KEY_NAME"));
			t.setValue(rs.getString("KEY_VALUE"));
			return t;
		}
	}
	
	private final class HostRowMapper implements RowMapper<Host> {
		
		public Host mapRow(ResultSet rs, int rowNum) throws SQLException {
			Host host = new Host();
			host.setId(rs.getInt("ID"));
			host.setTestCategoryId(rs.getInt("test_category_id"));
			host.setHostname(rs.getString("hostname"));
			host.setPort(rs.getInt("port"));
			host.setName(rs.getString("name"));
			host.setSecureHttp(rs.getInt("securehttp") == 1);
			return host;
		}
	}
	
	private final class TestCaseRunMapper implements RowMapper<TestCaseRun> {
		
		public TestCaseRun mapRow(ResultSet rs, int rowNum) throws SQLException {
			TestCaseRun run = new TestCaseRun();
			run.setId(rs.getInt("id"));
			run.setTestCaseInstanceId(rs.getInt("TESTCASE_INSTANCE_ID"));
			run.setSuccess(rs.getInt("SUCCESS") == 1);
			run.setRunDate(rs.getDate("RUN_DATE"));
			run.setOutput(rs.getString("RUN_OUTPUT"));
			return run;
		}
	}


}
