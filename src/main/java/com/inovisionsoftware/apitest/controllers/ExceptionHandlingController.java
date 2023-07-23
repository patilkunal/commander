package com.inovisionsoftware.apitest.controllers;

import com.inovisionsoftware.apitest.exception.CronExpressionException;
import org.apache.http.conn.HttpHostConnectException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ExceptionHandlingController {

	private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingController.class);
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
	}
	
	@ExceptionHandler({DataAccessException.class})
	@ResponseStatus(value=HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody String handleDatabaseErrors(DataAccessException exception) {
		logger.error("Database error : " + exception.getMessage(), exception);
		return exception.getMessage();
	}
	
	@ExceptionHandler({CronExpressionException.class})
	@ResponseStatus(value=HttpStatus.BAD_REQUEST)
	public @ResponseBody String handleCronExpressionError(CronExpressionException e) {
		logger.error("Cron Expression Exception : "  + e.getMessage());
		return e.getMessage();
	}
	
	
}
