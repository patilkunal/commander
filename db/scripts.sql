CREATE TABLE TEST_CATEGORY(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	NAME VARCHAR(20),DESCRIPTION VARCHAR(255));
	
CREATE TABLE HOSTS(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	DESCRIPTION VARCHAR(255),
	HOSTNAME VARCHAR(255) NOT NULL,
	PORT INTEGER NOT NULL);

CREATE TABLE TESTCASE(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	NAME VARCHAR(20),
	DESCRIPTION VARCHAR(255), 
	TEST_CATEGORY_ID INTEGER NOT NULL, 
	REST_URL VARCHAR(255) NOT NULL,
	HTTP_METHOD VARCHAR(10) NOT NULL,
	HTTP_DATA VARCHAR(4000));
	
CREATE TABLE TESTCASE_INSTANCE(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	NAME VARCHAR(20), 
	DESCRIPTION VARCHAR(255),
	TESTCASE_ID INTEGER NOT NULL,
	USER_ID INTEGER NOT NULL,
	CONSTRAINT FK_TESTINSTANCE_TESTCASE FOREIGN KEY(TESTCASE_ID) REFERENCES TESTCASE(ID),
	CONSTRAINT FK_TESTINSTANCE_USERS FOREIGN KEY(USER_ID) REFERENCES USERS(ID));

CREATE TABLE TESTCASE_VALUES(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	TESTCASE_INSTANCE_ID INTEGER NOT NULL,
	KEY_NAME VARCHAR(50) NOT NULL,
	KEY_VALUE VARCHAR(255) NOT NULL);

CREATE TABLE TESTCASE_RUN(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	TESTCASE_INSTANCE_ID INTEGER NOT NULL,
	RUN_DATE DATE DEFAULT NOW,
	RUN_OUTPUT VARCHAR(4000));

CREATE TABLE SCHEDULES(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	NAME VARCHAR(100),
	CRON_EXPR VARCHAR(100),
	ACTIVE INTEGER DEFAULT 0);

CREATE TABLE SCHEDULED_TESTCASES(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
	SCHEDULE_ID INTEGER NOT NULL,
	TESTCASE_INSTANCE_ID INTEGER NOT NULL,
	CONSTRAINT fk_schedule FOREIGN KEY (SCHEDULE_ID) REFERENCES SCHEDULES(ID),
	CONSTRAINT fk_testcase_instance FOREIGN KEY (TESTCASE_INSTANCE_ID) REFERENCES TESTCASE_INSTANCE(ID));
	
CREATE TABLE USERS(ID INTEGER GENERATED BY DEFAULT AS IDENTITY(START WITH 0) NOT NULL PRIMARY KEY,
		USERNAME VARCHAR(100) NOT NULL,
		PASSWORD VARCHAR(100),
		NAME VARCHAR(255),
		EMAIL VARCHAR(255));

insert into users(username, password, name, email) values('kpatil','','Kunal Patil', 'kunal.patil@cox.com');
		
	
insert into test_category(name, description) values('BATCH', 'Batch Server Test Cases');
	
insert into hosts(hostname, port, description) values('localhost', 8080, 'Local Machine');
insert into hosts(hostname, port, description) values('localhost', 9090, 'DEV VM (via SSH Tunnel)');
insert into hosts(hostname, port, description) values('10.8.172.139', 8080, 'DEV VM (Direct)');

insert into testcase(name, description, test_category_id, rest_url, http_method, http_data)
values('Get BSID Import Scheduled Jobs', 'Get a list of all BSID Import scheduled job list', 0, '/batch/scheduledBatchJob/bsidImport', 'GET', '');
insert into testcase_instance(name, description, testcase_id)
values('Get BSID Import Scheduled Jobs', 'Get a list of all BSID Import scheduled job list', 0);
insert into testcase(name, description, test_category_id, rest_url, http_method, http_data)
values('Get VOD Import Scheduled Jobs', 'Get a list of all VOD Import scheduled job list', 0, '/scheduler/scheduledBatchJob/vodImport', 'GET', '');
insert into testcase_instance(name, description, testcase_id)
values('Get VOD Import Scheduled Jobs', 'Get a list of all BSID Import scheduled job list', 1);