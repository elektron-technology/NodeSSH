var credentials = require("./../DONOTCOMMIT.js")();
var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
var tap = require("tap");
//
tap.test("Simple exec command",function (t) {
	t.plan(7);
	t.doesNotThrow(function () {
		//SSHClient
		var SSHClient = require("./../lib/index.js")(options);
		//Commands 
		SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
		SSHClient.on('output', function(data,lastChunk) { });
		//Connection
		SSHClient.once('closed', function(addr,err) { 
			if (err) {
				t.ok(false,"Error on session",err); 
			}else { t.ok(true,"SSH Session has being closed.");  }
		});
		SSHClient.on("connected",function (host) {
			t.ok(true,"Event 'Connected' reached.");
			t.doesNotThrow(function () { 
				SSHClient.exec("pwd",function (resp,finished) {
					if (finished) {
						t.ok(true,"Reached first command end")
						t.doesNotThrow(function () { 
							SSHClient.exec("time",function (resp2,finished2) {
								if (finished2) {
									t.ok(true,"Reached second command end");
									SSHClient.close();
								}
							});
						});
					}
				});
			});
		});
		SSHClient.connect();
	});
});
//