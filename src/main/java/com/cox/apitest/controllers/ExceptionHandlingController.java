package com.cox.apitest.controllers;

import org.apache.http.conn.HttpHostConnectException;
import org.apache.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ExceptionHandlingController {

	private static final Logger logger = Logger.getLogger(ExceptionHandlingController.class);  
	/*
	@ExceptionHandler({SQLException.class, DataAccessException.class})
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR, reason="Error saving data to database")
	public void databaseError() {
		
	}
	
	@ExceptionHandler({HttpHostConnectException.class, java.net.ConnectException.class})
	@ResponseStatus(value=HttpStatus.NOT_FOUND, reason="Unable to connect to REST API Host or it does not exist")
	public void httpConnectError() {
		
	}
	*/
	
	@ExceptionHandler({HttpHostConnectException.class, java.net.ConnectException.class})
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody String handleHttpHostConnectException(HttpHostConnectException exception) {
		logger.error("Error : " + exception.getMessage());
		return exception.getMessage();
//		ModelAndView mv = new ModelAndView();
//		mv.addObject("exception", exception);
//		mv.setViewName("error");
//		return mv;
	}
	
	@ExceptionHandler({DataAccessException.class})
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody String handleDatabaseErrors(DataAccessException exception) {
		logger.error("Database error : " + exception.getMessage(), exception);
		return exception.getMessage();
//		ModelAndView mv = new ModelAndView();
//		mv.addObject("exception", exception);
//		mv.setViewName("error");
//		return mv;
	}
	
	
}
