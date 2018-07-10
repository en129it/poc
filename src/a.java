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
