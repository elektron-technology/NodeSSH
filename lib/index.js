var spawn = require('child_process').spawn,
	assert = require('assert'),
	util = require('util');


module.exports = function (options) {	return new SSHClient(options); }
require('util').inherits(SSHClient, require('events').EventEmitter);
//Initialize SSHClient APi
function SSHClient(options) {	SSHClientSession = this;
	//Checks for required values
	if (!options) {
		var errMsg = "options **REQUIRED** value is not specified.";
		util.debug(errMsg); assert.ok(errMsg);
	} else if (!options["host"]) { 
		var errMsg = "host **REQUIRED** value is missing on SSHClient Session initialization.";
		util.debug(errMsg); assert.ok(errMsg);
	} else if (!options["username"]) { 
		var errMsg = "username **REQUIRED** value is missing on SSHClient Session initialization.";
		util.debug(errMsg); assert.ok(errMsg);
	}
	
	//Set required values 
	SSHClientSession.host = options["host"];
	SSHClientSession.username = options["username"];
	//Set optional values
	if (options && options["port"]) { SSHClientSession.port = options["port"]; }
	else { SSHClientSession.port = 22; }
	//Are color enabled
	if (options && options["colors"]) { SSHClientSession.sshColors = options["colors"]; }
	else { SSHClientSession.sshColors = false; }
	//PASSWORD
	if (options && options["password"]) { 
		SSHClientSession.password = options["password"]; 
		SSHClientSession.cert = "null" ;
	}
	//Check for certificate AFTER PASSWORD, so password will have the preference...
	else { 
		SSHClientSession.password = "null" ;
		if (options && options["certificate"]) { SSHClientSession.cert = options["certificate"]; }
		else { SSHClientSession.cert = "null" ; }
	}
	//Helpers
	SSHClientSession.connected = false;	SSHClientSession.child = null;
};


SSHClient.prototype.connect = function connect() {
	if (SSHClientSession.connected == true || SSHClientSession.child) {
		//Log
		var errMsg = "SSHClient Session alerady have SSH child stabilished! Disconnecting and opening a new SSH session :)";
		util.debug(errMsg);
		SSHClientSession.close(null); //close
		SSHClientSession.connect(); //recall connect
		return;
	}
	//Create Child
	SSHClientSession.child = spawn('expect', [__dirname+'/login.exp', SSHClientSession.host, SSHClientSession.username, SSHClientSession.password, SSHClientSession.port, SSHClientSession.cert]);
	//Stdout data
	SSHClientSession.child.stdout.on("data",function (data) {
		return SSHClientSession.read(data.toString());
	});
	//Stderr data
	SSHClientSession.child.stderr.on("data",function (data) {
		return SSHClientSession.emit('stderr',data.toString());
	});
	//Child exit
	SSHClientSession.child.on("exit",function () {
		return SSHClientSession.close(null);
	});
};
SSHClient.prototype.exec = function exec(cmd, callback){
	//Checks for required values
	if (!cmd || !typeof cmd==='string') { 
		var errMsg = "cmd **REQUIRED** value on exec() is missing or not a string.";
		util.debug(errMsg); assert.ok(errMsg); return;
	}
	else if (!callback || !typeof callback==='function') { 
		var errMsg = "callback **REQUIRED** value on exec() is missing or not a function.";
		util.debug(errMsg); assert.ok(errMsg); return;
	}
	//Write command
	SSHClientSession.write(cmd);
	//Get 
	SSHClientSession.once('output',function(data){ return callback(data); });
};
SSHClient.prototype.write = function write(data) {
	return SSHClientSession.child && SSHClientSession.child.stdin.writable ? SSHClientSession.child.stdin.write(data+"\r") : false;
};
SSHClient.prototype.read = function read(data) {
	//
	if(!data) { return; }
	else {
		//Remove colors if needed
		if (!SSHClientSession.sshColors || SSHClientSession.sshColors == false) {  data = data.replace(/\[[0-9]{0,2};?[0-9]{1,3}m/g,""); }
		//Check if is connected
		if (SSHClientSession.connected == true) {
			var isLast = false;
			if(data.match(/[#|$]\s$/)) { isLast = true; }
			//Send each line by output
			var lines = data.split("\n");
			for (var i = 0; i < lines.length; i++) {
				var str = lines[i];
				if (str) { 
					if (isLast == true && i+1 == lines.length) {
						SSHClientSession.emit('output',null,isLast); 
					}else {	
						str = str.replace("\r","");
						SSHClientSession.emit('output',str,false); 
					}
				}	
			}
		}//Connection errors
		else if(data.match(/^Connection refuse/) || data.match(/^ssh: Could not/) || data.match(/^Permission denied/) || data.match(/^Login failed/) || data.match(/^No password is specified/)) {
			console.error("->",data);
			return SSHClientSession.close(data);
		}//Check if is logged now
		else if (data=='Logged') { 
			SSHClientSession.connected=true;
			SSHClientSession.emit('connected',SSHClientSession.host);
		}
	}
};
SSHClient.prototype.close = function close(errorString){
	if(SSHClientSession.child && SSHClientSession.child.kill) SSHClientSession.child.kill();
	//Clean	
	SSHClientSession.connected = false;
	if (SSHClientSession.child) {
		SSHClientSession.child.removeAllListeners("exit");
		SSHClientSession.child = null ;	
		//Emit close
		SSHClientSession.emit('closed',SSHClientSession.host,errorString);
	}
};