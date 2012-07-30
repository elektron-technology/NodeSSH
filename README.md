# NodeSSH

A lightweight SSH Client for Node.js.

## About

NodeSSH is a SSH client for node.js. I would call it lightweight, but since it spawns subprocesses, this makes it heavyweight to me. It uses OpenSSH and expect. Make sure you have installed this software.

Use your system's built-in package manager (apt-get,yum,rpm,dselect,etc..) to install expect on you machine. Most systems (OSX included) should already have this installed. This will not work with windows machines.

## Requirements

- [npm](https://github.com/isaacs/npm)
- [OpenSSH](http://www.openssh.org)

## Installation

Download and install dependencies

    $ npm install

## Usage

    var options = { host:"localhost", username:"USER", password:"PASS", port: 22 };
    var SSHClient = require("NodeSSH")(options);
    SSHClient.on("connected",function (host) {
	    SSHClient.exec("pwd",function(data){ 
	    	console.log("Server response:",data);
	    	SSHClient.close(); 
	    });
    })
    SSHClient.connect();

More samples at `samples/` directory.

## Methods

#### Initialize Wrapper

Parameters:

* options - **Type:**OptionObject - **Description:**Options Object - **REQUIRED**
* options.host - **Type:**string - **Description:**SSH host to be connected - **REQUIRED**
* options.username - **Type:**string - **Description:**SSH username to be authenticated - **REQUIRED**
* options.certificate - **Type:**string - **Description:**Local SSH key path to authenticate with remote host - **OPTIONAL**
* options.port - **Type:**integer - **Description:**Remote host SSH port - **OPTIONAL** (Default is 22)
* options.colors - **Type:**boolean - **Description:**Use or NOT SSH color syntax - **OPTIONAL** (Default is false)

Sample:

    var options = { host:"localhost", username:"USER", password:"PASS", port: 22 };
    var SSHClient = require("NodeSSH")(options);
    SSHClient.on("connected",function (host) {
	    SSHClient.close();
    })
    SSHClient.connect();
---
#### Connect Session

This function will try to connect to remote host.

Sample:

    SSHClient.connect();
---
#### Write Command

This function will not call error listener, it'll call 'output'/'input'/'stderr' events.  

Parameters:
- command - **Type:**string - **Description:**Command to be write on remote host. - **REQUIRED**

Sample:

    SSHClient.write("pwd");
---
#### Execute Command
This command is a `write` shortcut…

Sample:

    SSHClient.on("connected",function (host) {
	SSHClient.exec("pwd",function(data){
		SSHClient.close();
	});
})

---
#### Close session
This method will close SSH session.

Sample:

    SSHClient.close();


## Events

####Connected 
This event will be fired when SSH Session has being established. You must execute `.connect()` function to start connection process.

Event-String: `connected`

Sample:

	//Connections events
	SSHClient.on("connected",function (host) {
		console.log("Connected to host:",host);
	});
---
####Closed 
This event will be fired when SSH Session has being closed (with success or not). You must execute `.close()` function to close connection process.

Event-String: `closed`

Sample:

	//Connections events
	SSHClient.on("closed",function (host) {
		console.log("Disconnected from host:",host);
	});
---
####Error 
This event will be fired when SSH Session had an error on it stack.

Event-String: `error`

Sample:

	//Connections events
	SSHClient.on("error",function (host,err) {
		console.log("Error in connection:",err);
		console.log("Disconnected from host:",host);
	});	
---
####Input 
This event will be fired when any command from you is written on remote connection stream.

Event-String: `input`

Sample:

	//Command events
	SSHClient.on('input', function(data) {
		console.log("input-> "+data);
	});
---
####Output 
This event will be fired when any command is outputted by remote connection.

Event-String: `output`

Sample:

	//Command events
	SSHClient.on('output', function(data) {
		console.log("output-> "+data);
	});
---
####StdErr 
This event will be fired when any errored command is outputted by remote connection.

Event-String: `stderr`

Sample:

	//Command events
	SSHClient.on('stderr', function(err) {
		console.log("stderr-> "+err);
	});

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

TODO