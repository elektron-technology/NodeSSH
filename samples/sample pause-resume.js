var credentials = require("./../DONOTCOMMIT.js")();
var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
//SSHClient
var SSHClient = require("./../lib/index.js")(options);
var paused = false;
//Commands 
SSHClient.on('stderr', function(err) { console.log("Error on StdErr",err); });
SSHClient.on('output', function(data,lastChunk) { 
	if (lastChunk == true) {
		console.log("Should close connection");
		SSHClient.close();
	}
	if (data) {
		console.log("data->",data);
		if (paused == false) {
			paused = true;
			setTimeout(function () { console.log("pause"); SSHClient.pauseOutput(); },10);
			setTimeout(function () {
				console.log("resuming");
				SSHClient.resumeOutput();
			},2000);	
		}
	}
});
//Connection
SSHClient.once('closed', function(addr,err) { 
	if (err) {
		console.log("Error on session",err); 
	}else { console.log("SSH Session has being closed."); }
});
SSHClient.on("connected",function (host) {
	console.log("Connected",host);
	SSHClient.write("ping -c 3 10.0.1.255");
});
SSHClient.connect();