package com.inovisionsoftware.apitest.controllers;

import java.util.ArrayList;
import java.util.List;

import com.inovisionsoftware.apitest.dao.TestCaseDAO;
import com.inovisionsoftware.apitest.manager.TestRunManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.inovisionsoftware.apitest.model.Statistics;
import com.inovisionsoftware.apitest.model.TestCaseCategory;
import com.inovisionsoftware.apitest.model.TestCaseInstance;
import com.inovisionsoftware.apitest.model.TestCaseRun;
import com.inovisionsoftware.apitest.model.TestCaseRunFilter;

@Controller
@RequestMapping(value="/stats")
public class StatsController {

	@Autowired
	private TestCaseDAO dao;
	
	@Autowired
	private TestRunManager mgr;
	
	@RequestMapping(value="/categories", method=RequestMethod.GET)
	public @ResponseBody ArrayList<Statistics> getCategoriesStats() {
		ArrayList<Statistics> stats = new ArrayList<Statistics>();
		List<TestCaseCategory> cats = dao.getTestCategories();
		TestCaseRunFilter filter = new TestCaseRunFilter();
		for(TestCaseCategory c : cats) {
			filter.setTestCaseCategoryId(c.getId());
			List<TestCaseRun> runs = dao.getTestCaseRuns(filter);
			int success = 0;
			int failures = 0;
			for(TestCaseRun r : runs) {
				//if((r.getRunDate() != null) && (r.getOutput() != null)) {
					if(r.isSuccess()) {
						success++;
					} else {
						failures++;
					}
				//}
			}
			stats.add(new Statistics(c.getName(), c.getName(), success, failures));
		}
		
		return stats;
	}
	
	@RequestMapping(value="/tests/category/{categoryId}", method=RequestMethod.GET)
	public @ResponseBody List<Statistics> getTestByCategoryStats(@PathVariable("categoryId") int categoryId) {
		List<Statistics> stats = new ArrayList<Statistics>();
		
		TestCaseCategory cat = dao.getTestCategory(categoryId);
		
		TestCaseRunFilter filter = new TestCaseRunFilter();
		filter.setTestCaseCategoryId(categoryId);
		List<TestCaseRun> runs = dao.getTestCaseRuns(filter);
		for(TestCaseRun r : runs) {
			TestCaseInstance ti = r.getTestCaseInstance();
			Statistics s = new Statistics(cat.getName(), ti.getName(), 0, 0);
			Statistics stat = null;
			if(!stats.contains(s)) {
				stats.add(s);
				stat = s;
			} else {
				stat = stats.get(stats.indexOf(s));
			}
			//with outer join we may not have a run, so check for output and rundate for null values
			if((r.getRunDate() != null) && (r.getOutput() != null)) {
				if(r.isSuccess()) {
					stat.setSuccess(stat.getSuccess()+1);
				} else {
					stat.setFailures(stat.getFailures()+1);
				}
			}
		}
		
		
		return stats;
	}

	@RequestMapping(value="/tests/{testId}", method=RequestMethod.GET)
	public void getTestStats() {
		
	}
	
}
