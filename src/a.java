Open a CMD, go to [wlp root]/bin
Execute: server create jms-messaging-engine
This creates a new server named jms-messaging-engine
Add the new jms-messaging-engine  server in Eclipse
Edit its server.xml
Click onto HTTP Endpoint in left pane and change the Port to 9081
Click onto Feature Manager in the left pane. This opens the FeatureManager table in the right pane
Click onto Add… button in the right pane
Search and add feature wasJmsServer-1.0

Click onto Server Configuration in the left pane
Click onto Add… button and select WAS JMS endpoint
The proposed values are: host: localhost, port 7276, secure port 7286

Click onto Server Configuration in the left pane
Click onto Add…. Button and select Messaging Engine
In the right pane, click Add… button

Select Topic Space
	Force Reliability: ExpressionNonPersistent
	Max Message Depth: 5000
	Topic Space name: ExpressionNonPersistent.Topic.Space

Edit server.xml of defaultServer which will be used as JMS client
Select Feature Manager then click Add… button in the right pane
Select successively jndi-1.0, mdb-3.2, wasJmsClient-2.0
Select Server Configuration in the left pane then click onto Add… button
Search for JMS Topic Connection Factory
	Connection Manager Reference: ConMgr1
	JNDI Name: jms/TCF
Id: jmsClient1
In the right pane click onto the Add… button inside the 4 child elements are available section
Select Embedded Messaging
	Remote Server Address: localhost:7276: BootstrapBasicMessaging

Select Feature Manager then click Add… button in the right pane
Select Connection Manager
	Id: ConMgr1

Select Feature Manager then click Add… button in the right pane
Select JMS Topic
	Id: myResponseTopic
	JNDI Name: jms/myResponseTopic
In the right pane click onto the Add… button inside the 1 child elements are available section
Select Embedded Messaging
	Delivery Mode: NonPersistent
	Time To Live: 60000
	Priority: 1
	Read Ahead: AsConnection
	Topic Name: MyResponses
	Topic Space: ExpressNonPersistent.Topic.Space

		InitialContext ctx = new InitialContext();
		NamingEnumeration<NameClassPair> list = ctx.list("");
		System.out.println("############ JNDI start");
		while (list.hasMore()) {
		  System.out.println(list.next().getName());
		}
		System.out.println("############ JNDI end");
		
		TopicConnectionFactory topicConnectionfactory;
		Topic topic;
		try {
		  topicConnectionfactory = (TopicConnectionFactory) InitialContext.doLookup("jms/TCF");
		  
		  System.out.println("topicConnectionFactory " + topicConnectionfactory);
		  
		  topic = (Topic) InitialContext.doLookup("jms/myResponseTopic");
		  
		  System.out.println("topic " + topic);
		  
		} catch (NamingException e) {
			e.printStackTrace();
		}
		try (TopicConnection topicConnection = topicConnectionfactory.createTopicConnection()) {
		  topicConnection.start();    
		  TopicSession topicSession = topicConnection.createTopicSession(false,  javax.jms.Session.AUTO_ACKNOWLEDGE);    
		  TopicPublisher topicPublisher = topicSession.createPublisher(topic);
		  topicPublisher.publish(topicSession.createTextMessage(“Hello world”));
		} catch (JMSException e) {
		}





1.	The goal is to enforce the password policy currently implemented in TOTO.

2.	The new policy applies only to any password typed in by users in the TOTO page. 

Users can change their password at any time by selecting TOTO from the main menu or when they are forced to do so after having logged into TOTO when their current password has exceeded the maximum password usage age. That age is specified on a company basis and is TOTO days by default

3.	As a consequence of 2., users whose current password does not meet the new policy rules will not be affected: they will be impacted only when they change their password.

4.	The current password policy implemented in TOTO is:

a.	Length must be between 8 and 32 characters
b.	Inclusion of at least one upper case letter
c.	Inclusion of at least one digit
d.	No white space character
e.	No reuse of a password in use during a specific retention period. That period is XXX months 

5.	The current password policy will be enforced with the following rules: 

a.	Inclusion of a special character. Special characters have ASCII code is in the range [33-126] (where the range bounds are decimal numbers) and are not in [0-9,A-Z,a-z]
b.	Prohibition of words found in user personal information including the company to which there are attached.

a.	Is considered as user personal information:
b.	Is considered as company information:
c.	Checking for the presence of words is case insensitive. This means that if ‘Bob’ is the first name of the connected user then for example ‘BOB’, ‘bOB’ and ‘bob’ are considered as similar to ‘Bob’
d.	Each password part that is matching a. or b. in a case insensitive way is removed from the password. The resulting password after the removal is then tested against 4. and 5.a. to determine if the password meets the policy rules. For example if ‘Bob’ is the first name of the connected user then:
Original password	Modified password	Is authorized?
Toto1234*		Toto1234*		Yes  
BOB1234*		1234*			No because does not meet 4.a.
BOBAlice1234*		Alice1234*		Yes

c.	Prohibition of passwords contained in a password black list.
a.	The list is stored in a new TOTO database table in the TOTO database schema
b.	The database table content can be modified at any time through SQL script
c.	No TOTO page will provide the ability to read or manage that blacklist
d.	Checking for the presence of a password in the blacklist is case insensitive. This means that if the blacklist contains ‘Password123’ then for example ‘PASSWORD123’, ‘passWord123’ and ‘password123’ are not authorized passwords. However ‘Password1234’ is authorized.

6.	The TOTO page is modified as follow:

a.	Option 1: when the user submits a new password that does not meet the policy rules 
	4. and 5.a.-b. then “Your password does not meet the password policy rules. Click here to access the policy rules” is displayed is a red warning banner. The keyword “here” is in bold and is a hyperlink to the Password Policy page.
	5.c. then “Your password is too common and can be easily guessed” is displayed is a red warning banner
b.	Option 2: a “Password Policy Rules” hyperlink is displayed at the right of the Save and Cancel buttons. That link brings the user to the TOTO page. When the user submits a new password that does not meet the policy rules
	4. and 5.a.-b. then “Your password does not meet the password policy rules” is displayed in a red banner.
	5.c. then “Your password is too common and can be easily guessed” is displayed is a red warning banner

7.	The TOTO page is a new page with following content:

Password policy rules:
•	Length
Passwords must have at least 8 characters and cannot exceed 32 characters
•	Complexity
Passwords must contain the following four characters types: lower case letter, upper case letter, digits and symbols
Passwords cannot contain white spaces
•	History
Passwords that were in use during the last XX months cannot be re-used
•	User personal information
Passwords may contain personal user information however that information is ignored when testing the password complexity strength. So if your first name is ‘Bob’ then password ‘BOB1234a@’ is not authorized because ignoring ‘BOB’ the password length is only 6 characters. Personal information includes:  

Back button: redirects the user to the previous page






<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

https://spring.io/guides/gs/messaging-redis/
http://oppalove.com/2017/03/06/spring-boot-redis-json-examlpe/?i=1
