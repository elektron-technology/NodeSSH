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
						t.ok(!lastChunk,"It's not finished (flag says)");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"It's not finished (flag says)");
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
tap.test("\nConnect without command",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")();
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
	t.plan(4);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		SSHClient.on('output', function(data,lastChunk) { t.ok(false,"Output without command",err); });
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () {  SSHClient.close(); });
		});
		SSHClient.connect();
	});
});
//
tap.test("\nSimple Command Certificate",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")(true);
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(),certificate:credentials.TESTCertificateFile(), port:credentials.TESTPort() };
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
						t.ok(!lastChunk,"It's not finished (flag says)");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"It's not finished (flag says)");
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
tap.test("\nSimple Command Certificate Pause-Resume",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")(true);
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(),certificate:credentials.TESTCertificateFile(), port:credentials.TESTPort() };
	t.plan(12);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "", paused = "";
		SSHClient.on('output', function(data,lastChunk) { 
			if (paused) { t.ok(false,"Should not send data while paused"); }
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
						t.ok(!lastChunk,"It's not finished (flag says)");
						container = "";
						commandReceived = true;
						//
						paused = true;
						SSHClient.pauseOutput();
						t.ok(true,"Pause"); 
						setTimeout(function () {
							paused = false;
							t.ok(true,"Resumed"); 
							SSHClient.resumeOutput();
						},1500);
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"It's not finished (flag says)");
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
tap.test("\nComplex Command Pause-Resume",function (t) {
	var credentials = require("./../DONOTCOMMIT.js")(false);
	var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
	t.plan(12);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		var dataReceived = false, commandReceived = false, container = "", paused = false, alreadyPaused = false;
		SSHClient.on('output', function(data,lastChunk) { 
			if (paused) { t.ok(false,"Should not send data while paused"); }
			if (lastChunk == true) {
				t.ok(true,"Last chunk received, closing session.");
				t.ok((!data ? true : false),"Last chunk data is null");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					t.ok(true,"Input command received"); 
					t.ok(!lastChunk,"It's not finished (flag says)");
					container = "";
					commandReceived = true;
				}else if (!alreadyPaused || !dataReceived) {
					if (!alreadyPaused) {
						alreadyPaused = true; paused = true;
						SSHClient.pauseOutput();
						t.ok(true,"Initial command response received");
						t.ok(!lastChunk,"It's not finished (flag says)");
						setTimeout(function () {
							paused = false;	 SSHClient.resumeOutput();
						},1500);
					}else {
						t.ok(true,"Final command response received");
						t.ok(!lastChunk,"It's not finished (flag says)");
						dataReceived = true;	
					}
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
			t.doesNotThrow(function () { SSHClient.write("ping -c 3 10.0.1.255"); });
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
				t.ok((!data ? true : false),"It's not finished (flag says)");
				SSHClient.close();
			}
			if (data) {
				if (!commandReceived) {
					container += data;
					if (container.match(/ping -c 2 10.0.1.255/)) {
						t.ok(true,"Input command received"); 
						t.ok(!lastChunk,"It's not finished (flag says)");
						container = "";
						commandReceived = true;
					}
				}else if (!dataReceived) {
					t.ok(true,"Command response received");
					t.ok(!lastChunk,"It's not finished (flag says)");
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