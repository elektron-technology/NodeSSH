var tap = require("tap");

//
tap.test("Simple Command",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")();
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
	t.plan(10);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "";
		SSHClient.on('output', function(data,lastChunk) { 
			if (lastChunk == true) {
				t.ok(true,"Last chunk received, closing session.");
				t.ok((!data ? true : false),"Last chunk data is null");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					container += data;
					if (container.match("pwd")) {
						t.ok(true,"Input command received"); 
						t.ok(!lastChunk,"Last Chunk flag is false");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"Last Chunk flag is false");
					dataReceived = true;
				}
			}
		});
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () { SSHClient.write("pwd"); });
		});
		SSHClient.connect();
	});
});
//
tap.test("\nSimple Command Certificate",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")(true);
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), certificate:credentials.TESTCertificateFile(), port:credentials.TESTPort() };
	t.plan(10);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "";
		SSHClient.on('output', function(data,lastChunk) { 
			if (lastChunk == true) {
				t.ok(true,"Last chunk received, closing session.");
				t.ok((!data ? true : false),"Last chunk data is null");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					container += data;
					if (container.match("pwd")) {
						t.ok(true,"Input command received"); 
						t.ok(!lastChunk,"Last Chunk flag is false");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"Last Chunk flag is false");
					dataReceived = true;
				}
			}
		});
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () { SSHClient.write("pwd"); });
		});
		SSHClient.connect();
	});
});
//
tap.test("\nSimple Command Pause-Resume",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")(false);
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
	t.plan(10);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "";
		SSHClient.on('output', function(data,lastChunk) { 
			if (lastChunk == true) {
				t.ok(true,"Last chunk received, closing session.");
				t.ok((!data ? true : false),"Last chunk data is null");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					container += data;
					if (container.match("pwd")) {
						t.ok(true,"Input command received"); 
						t.ok(!lastChunk,"Last Chunk flag is false");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"Last Chunk flag is false");
					dataReceived = true;
				}
			}
		});
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () { SSHClient.write("pwd"); });
		});
		SSHClient.connect();
	});
});
//
tap.test("\nComplex Command",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")();
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
	t.plan(10);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "";
		SSHClient.on('output', function(data,lastChunk) { 
			if (lastChunk == true) {
				t.ok(true,"Last chunk received, closing session.");
				t.ok((!data ? true : false),"Last chunk data is null");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					container += data;
					if (container.match(/ping -c 2 10.0.1.255/)) {
						t.ok(true,"Input command received"); 
						t.ok(!lastChunk,"Last Chunk flag is false");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"Last Chunk flag is false");
					dataReceived = true;
				}
			}
		});
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () { SSHClient.write("ping -c 2 10.0.1.255"); });
		});
		SSHClient.connect();
	});
});