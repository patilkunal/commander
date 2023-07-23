package com.inovisionsoftware.apitest.util;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import com.inovisionsoftware.apitest.decorator.ValueDecorator;
import com.inovisionsoftware.apitest.model.TestCaseValue;

public class ValueParser {

	private static final List<String> reservedKeywords = new ArrayList<String>(1);

	static {
		for(ValueDecorator vd : ValueDecorator.values()) {
			reservedKeywords.add(vd.name());
		}		
	}
	/**
	 * Parse URL and Data and get the placeholders
	 * @param url
	 * @param data
	 * @return
	 */
	public static List<TestCaseValue> parseTestCaseValues(String url, String data) {
		List<TestCaseValue> list = new ArrayList<TestCaseValue>(5);
		StringTokenizer tokenizer = new StringTokenizer(url, "/");
		String token = null;
		while(tokenizer.hasMoreTokens()) {
			token = tokenizer.nextToken();
			TestCaseValue tv = getTestCaseValue(token);
			if(tv != null) {
				list.add(tv);
			}
		}
		
		//do we have query string at end?
		if(token.indexOf('?') >= 0) {
			String querystring = token.substring(token.indexOf('?'));
			tokenizer = new StringTokenizer(querystring, "&");
			while(tokenizer.hasMoreTokens()) {
				String queryparams = tokenizer.nextToken();
				if(queryparams.contains("=")) {		
					String[] nvpair = queryparams.split("=");
					for(String nv: nvpair) {
						TestCaseValue tv = getTestCaseValue(nv);
						if(tv != null) {
							list.add(tv);
						}
					}
				} else {
					TestCaseValue tv = getTestCaseValue(queryparams);
					if(tv != null) {
						list.add(tv);
					}					
				}
			}
		}
		
		//TODO: Parse test case data for placeholders
		//JSONObject json = new JSONObject(data);
		return list;
	}
	
	public static TestCaseValue getTestCaseValue(String name) {
		TestCaseValue tv = null;
		if((name != null) && name.startsWith("#") && name.endsWith("#")) {
			//if placeholder starts with '?' then it is optional. TODO: do we put blank value? 
			String str = name.charAt(1) == '?' ? name.substring(2, name.length() - 1) : name.substring(1, name.length() - 1);
			if(!reservedKeywords.contains(str)) {
				tv = new TestCaseValue();
				tv.setName(str);
				if(name.charAt(1) == '?') {
					tv.setRequired(false);
				} else {
					tv.setRequired(true);				
				}
			}
		}
		return tv;
	}
	
}
