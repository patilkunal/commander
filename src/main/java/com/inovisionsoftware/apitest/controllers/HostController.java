package com.inovisionsoftware.apitest.controllers;

import java.util.List;

import com.inovisionsoftware.apitest.dao.TestCaseDAO;
import com.inovisionsoftware.apitest.model.Host;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/hosts")
public class HostController {

	@Autowired
	private TestCaseDAO dao;
	
	@RequestMapping(produces="application/json", method=RequestMethod.GET)
	public @ResponseBody List<Host> getHosts() {
		return dao.getHosts();
	}

	@RequestMapping(produces="application/json", value="/category/{categoryId}", method=RequestMethod.GET)
	public @ResponseBody List<Host> getHostByCategory(@PathVariable("categoryId") int categoryId) {		
		return dao.getHosts(categoryId);
	}
	
	@RequestMapping(produces="application/json", value="/{id}", method=RequestMethod.GET)
	public @ResponseBody Host getHost(@PathVariable("id") int id) {		
		return dao.getHost(id);
	}
	
	@RequestMapping(produces="application/json", method=RequestMethod.POST)
	public @ResponseBody Host saveHost(@RequestBody Host host) {		
		return dao.saveHost(host);
	}	

	@RequestMapping(produces="application/json", value="/{id}", method=RequestMethod.PUT)
	public @ResponseBody Host updateHost(@RequestBody Host host) {		
		return dao.saveHost(host);
	}	
	
	
}
