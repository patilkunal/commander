package com.cox.apitest.model;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

public interface ServerRequest<T> {

	public String getUrl();
	public T getRequestBody();
	public HttpMethod getMethod();
	public MediaType getResponseType();
}
