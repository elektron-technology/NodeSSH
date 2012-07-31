var credentials = require("./../DONOTCOMMIT.js")();
var options = { host:credentials.TESTHost(), username:credentials.TESTUser(), password:credentials.TESTPass(), port:credentials.TESTPort() };
//certificate:"/homeSync/gwdp/.ssh/id_rsa_key", port: 22 };
//SSHClient
var SSHClient = require("./../lib/index.js")(options);
//Commands 
SSHClient.on('stderr', function(err) { t.ok(false,"Error on StdErr",err); });
SSHClient.on('output', function(data,lastChunk) { 
	if (lastChunk == true) {
		console.log("Should close connection");
		SSHClient.close();
	}
	if (data) {
		if (data.match("pwd")) { console.log("Command data->",data);
		}else { console.log("Output data->",data); }
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
	SSHClient.write("pwd");
});
SSHClient.connect();