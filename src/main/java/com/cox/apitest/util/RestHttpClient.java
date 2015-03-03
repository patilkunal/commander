package com.cox.apitest.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import com.cox.apitest.model.Host;
import com.cox.apitest.model.TestCase;
import com.cox.apitest.model.TestResult;

@Component
public class RestHttpClient {

	private Logger logger = Logger.getLogger(RestHttpClient.class);
	
	private int maxHttpConnections;
	private int httpConnectionTimeout;
	private int socketTimeout;
	
	private PoolingHttpClientConnectionManager httpConnMgr;
	private HttpClientBuilder clientBuilder;
	
	public RestHttpClient() throws Exception {
		initialize();
	}
	
	@Value("${http.maxconnections}")
	public void setMaxHttpConnections(int maxHttpConnections) {
		this.maxHttpConnections = maxHttpConnections;
	}
	
	@Value("${http.connectiontimeout}")
	public void setHttpConnectionTimeout(int httpConnectionTimeout) {
		this.httpConnectionTimeout = httpConnectionTimeout;
	}
	
	@Value("${net.sockettimeout}")
	public void setSocketTimeout(int socketTimeout) {
		this.socketTimeout = socketTimeout;
	}
	
	private void initialize() throws Exception {
		logger.info("Initializing RestHttpClient");
		
		SSLContextBuilder ctxBuilder = new SSLContextBuilder();
		ctxBuilder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
		SSLConnectionSocketFactory sslSocketFactory = new SSLConnectionSocketFactory(ctxBuilder.build(), SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
		Registry<ConnectionSocketFactory> socketFactoryRegistry = 
				RegistryBuilder.<ConnectionSocketFactory>create()
				.register("https", sslSocketFactory)
				.register("http", PlainConnectionSocketFactory.getSocketFactory()).build();
		
		httpConnMgr = new PoolingHttpClientConnectionManager(socketFactoryRegistry);
		httpConnMgr.setDefaultMaxPerRoute(maxHttpConnections);
		httpConnMgr.setMaxTotal(maxHttpConnections);
		
		RequestConfig requestConfig = RequestConfig.custom()
										.setConnectTimeout(httpConnectionTimeout)
										.setProxy(null)
										.setSocketTimeout(socketTimeout)
										.build();
		clientBuilder = HttpClientBuilder.create();
		clientBuilder.setDefaultRequestConfig(requestConfig);
		List<Header> headers = new ArrayList<Header>();
		headers.add(new BasicHeader("Accept", "application/json"));
		headers.add(new BasicHeader("Accept", "text/plain"));
		headers.add(new BasicHeader("Content-Type", "application/json"));
		clientBuilder.setDefaultHeaders(headers);
	}
	
	public CloseableHttpClient getHttpClient() {
		return clientBuilder.build();
	}
	

	public void shutdown() {
		httpConnMgr.shutdown();
	}
	
	public TestResult doHttpRequest(TestCase testCase, Host host) throws Exception {
		if(HttpMethod.GET.equals(testCase.getMethod())) {
			return doHttpGet(testCase, host);
		} else if(HttpMethod.POST.equals(testCase.getMethod())) {
			return doHttpPost(testCase, host);
		} else if(HttpMethod.DELETE.equals(testCase.getMethod())) {
			return doHttpDelete(testCase, host);
		} else if(HttpMethod.PUT.equals(testCase.getMethod())) {
			return doHttpPut(testCase, host);
		} else {
			throw new Exception("Invalid Http Method");
		}
	}
	
	public TestResult doHttpGet(TestCase testCase, Host host) throws Exception {
		HttpGet httpGet = new HttpGet(makeUrl(testCase, host));
		return executeHttpCommand(httpGet, testCase);
		/*
		TestResult result = new TestResult();
		CloseableHttpClient httpClient = getHttpClient();
	 	CloseableHttpResponse resp = httpClient.execute(httpGet);
 		result.setErrorCode(resp.getStatusLine().getStatusCode());
	 	if(resp.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
	 		result.setResult(getResponse(resp.getEntity()));
	 		result.setSuccess(true);
	 	} else {
	 		result.setError(resp.getStatusLine().toString());
	 	}
	 	
	 	return result;
	 	*/
	}
	
	public TestResult doHttpDelete(TestCase testCase, Host host) throws Exception {
		HttpDelete httpdelete = new HttpDelete(makeUrl(testCase, host));
		return executeHttpCommand(httpdelete, testCase);
		/*
		TestResult response = new TestResult();
		HttpDelete httpdelete = new HttpDelete(makeUrl(testCase, host));
		CloseableHttpClient httpClient = getHttpClient();
		try {
			CloseableHttpResponse resp = httpClient.execute(httpdelete);
	 		response.setErrorCode(resp.getStatusLine().getStatusCode());
		 	if(resp.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
		 		response.setResult(getResponse(resp.getEntity()));
		 		response.setSuccess(true);
		 	} else {
		 		response.setError(resp.getStatusLine().toString());
		 	}
		} catch(Exception e) {
			response.setSuccess(false);
			response.setError(e.getMessage());
		}
		return response;
		*/
	}

	public TestResult doHttpPost(TestCase testCase, Host host) throws Exception {
		HttpPost httpPost = new HttpPost(makeUrl(testCase, host));
		return executeHttpCommand(httpPost, testCase);
		/*
		TestResult response = new TestResult();
		HttpPost httpPost = new HttpPost(makeUrl(testCase, host));
		HttpEntity entity = new StringEntity(testCase.getData());
		httpPost.setEntity(entity);
		CloseableHttpClient httpClient = getHttpClient();
		//httpPost.setHeader("Content-Type", "application/json");
		try {
			CloseableHttpResponse resp = httpClient.execute(httpPost);
	 		response.setResult(getResponse(resp.getEntity()));
	 		response.setErrorCode(resp.getStatusLine().getStatusCode());
	 		response.setSuccess(true);
		} catch(Exception e) {
			response.setSuccess(false);
			response.setError(e.getMessage());
		}
	 	return response;
	 	*/
	}

	public TestResult doHttpPut(TestCase testCase, Host host) throws Exception {
		HttpPut httpput = new HttpPut(makeUrl(testCase, host));
		return executeHttpCommand(httpput, testCase);
		/*
		TestResult response = new TestResult();
		HttpPut httpput = new HttpPut(makeUrl(testCase, host));
		HttpEntity entity = new StringEntity(testCase.getData());
		httpput.setEntity(entity);
		CloseableHttpClient httpClient = getHttpClient();
		//httpPost.setHeader("Content-Type", "application/json");
	 	CloseableHttpResponse resp = httpClient.execute(httpput);
 		response.setResult(getResponse(resp.getEntity()));
 		response.setErrorCode(resp.getStatusLine().getStatusCode());
 		response.setSuccess(true);
	 	return response;
	 	*/
	}
	
	private TestResult executeHttpCommand(HttpRequestBase request, TestCase testCase) throws Exception {
		TestResult response = new TestResult();
		if(request instanceof HttpPost || request instanceof HttpPut) {
			HttpEntity entity = new StringEntity(testCase.getData());
			HttpEntityEnclosingRequestBase req = (HttpEntityEnclosingRequestBase)request;
			req.setEntity(entity);
		}
		CloseableHttpClient httpClient = getHttpClient();
		//httpPost.setHeader("Content-Type", "application/json");
		try {
			CloseableHttpResponse resp = httpClient.execute(request);
	 		response.setReturnCode(resp.getStatusLine().getStatusCode());
			if(resp.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
		 		response.setResult(getResponse(resp.getEntity()));
		 		response.setSuccess(true);
			} else {
				response.setSuccess(false);
				response.setError(resp.getStatusLine().toString());
			}
		} catch(Exception e) {
			response.setSuccess(false);
			response.setError(e.getMessage());
		}
	 	return response;		
	}
	
	private String getResponse(HttpEntity entity) throws IllegalStateException, IOException {
		StringBuilder buf = new StringBuilder();
		InputStream is = entity.getContent();
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		String str = null;
		while((str=reader.readLine()) != null) {
			buf.append(str);
		}
		return buf.toString();
	}
	
	private String makeUrl(TestCase testCase, Host host) {
		return String.format("%1$s%2$s", host.toUrlFormat(), testCase.getRestUrl());
	}
	 
}
