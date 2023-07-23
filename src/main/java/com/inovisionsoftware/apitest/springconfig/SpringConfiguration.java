package com.inovisionsoftware.apitest.springconfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.ContentNegotiatingViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.util.Arrays;

@Configuration
// @EnableWebMvc
//@ComponentScan(basePackages="com.cox.apitest")
//@ImportResource("classpath*:spring-config.xml")
//@PropertySource(value={"application.properties"})
public class SpringConfiguration { //extends WebMvcConfigurerAdapter {

	@Autowired
	Environment env;
	
	//@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		configurer.ignoreAcceptHeader(false)
					.useJaf(false)
					.favorPathExtension(true)
					.defaultContentType(MediaType.APPLICATION_JSON)
					.mediaType("xml", MediaType.APPLICATION_XML)
					.mediaType("json", MediaType.APPLICATION_JSON);
	}
	
	@Bean
	public ContentNegotiatingViewResolver viewResolver() {
//		BeanNameViewResolver beanResolver = new BeanNameViewResolver();
//		beanResolver.setOrder(1);
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setViewClass(org.springframework.web.servlet.view.JstlView.class);
		resolver.setPrefix("/WEB-INF/jsp/");
		resolver.setSuffix(".jsp");
		ContentNegotiatingViewResolver cresolver =  new ContentNegotiatingViewResolver();
		cresolver.setViewResolvers(Arrays.asList((ViewResolver)resolver)); //, (ViewResolver)xmlresolver)); //, (ViewResolver) beanResolver)
		return cresolver;		
	}

	
}
