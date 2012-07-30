var options = { host:"10.0.1.7", username:"USER", password:"PASS", port: 22 };
var SSHClient = require("./../lib/index.js")(options);
//
SSHClient.on("connected",function (host) {
	console.log("Connected");
	SSHClient.write("pwd");
})
SSHClient.on('input', function(data) {
	console.log("input-> "+data);
});
SSHClient.on('output', function(data) {
	console.log("output-> "+data);
	SSHClient.close();
});
SSHClient.once('closed', function(addr) {
	console.log('closed-> '+addr);
});
SSHClient.on('stderr', function(err) {
	console.log("stderr-> "+err);
});
SSHClient.on('error', function(addr,err) {
	console.log("error-> "+addr,err);
});
SSHClient.connect();