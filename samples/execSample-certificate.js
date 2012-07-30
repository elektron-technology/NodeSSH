var options = { host:"xxx.totendev.com", username:"user", certificate:"/homeSync/gwdp/.ssh/id_rsa_key", port: 22 };
var SSHClient = require("./../lib/index.js")(options);
//Command events
SSHClient.on('input', function(data) {
	console.log("input-> "+data);
});
SSHClient.on('output', function(data) {
	console.log("output-> "+data);
});
SSHClient.on('stderr', function(err) {
	console.log("stderr-> "+err);
});
//Connections events
SSHClient.on("connected",function (host) {
	SSHClient.exec("pwd",function(data){
		SSHClient.exec("ls -lha",function(data){ SSHClient.close(); });
	});
});
SSHClient.once('closed', function(addr) {
	console.log('closed-> '+addr);
});
SSHClient.on('error', function(addr,err) {
	console.log("error-> "+addr,err);
});
SSHClient.connect();