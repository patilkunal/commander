package com.cox.apitest.decorator;

public enum ValueDecorator {

	NOW(new DateFormatDecorator("yyyy-MM-dd'T'HH:mm:ss'Z'")),
	SATOKEN(new SaTokenDecorator());
	
	private Decorator decorator;
	
	ValueDecorator(Decorator decorator) {
		this.decorator = decorator;
	}
	
	public String getValue() {
		return decorator.getValue();
	}
}
