package com.cox.apitest.model;

public class Parameter {

	private String name;
	private int maxValue;
	private int minValue;
	private int value;

	public Parameter() {
	}
	
	public Parameter(String name, int min, int max, int value) {
		this.name = name;
		this.maxValue = max;
		this.minValue = min;
		this.value = value;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getMaxValue() {
		return maxValue;
	}
	public void setMaxValue(int maxValue) {
		this.maxValue = maxValue;
	}
	public int getMinValue() {
		return minValue;
	}
	public void setMinValue(int minValue) {
		this.minValue = minValue;
	}
	public void setValue(int value) {
		this.value = value;
	}
	public int getValue() {
		return value;
	}
	
}
