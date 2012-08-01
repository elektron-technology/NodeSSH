var credentials = require("./../DONOTCOMMIT.js")();
var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
var SSHClient = require("./../lib/index.js")(options);
//Connection
SSHClient.once('closed', function(addr,err) { 
	if (err) {
		console.log("Error on session",err); 
	}else { console.log("SSH Session has being closed."); }
});
SSHClient.on("connected",function (host) {
	console.log("Connected",host);
	SSHClient.exec("pwd",function (data,lastChunk) {
		if (lastChunk == true) {
			console.log("Should close connection");
			SSHClient.close();
		}
		if (data) {
			if (data.match("pwd")) { console.log("Command data->",data);
			}else { console.log("Output data->",data); }
		}
	});
});
SSHClient.connect();