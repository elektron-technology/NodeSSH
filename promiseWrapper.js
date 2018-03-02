var credentials = require('./DONOTCOMMIT.js')();
var options = {
  host: credentials.TESTHost(),
  username: credentials.TESTUser(),
  password: credentials.TESTPass(),
  port: credentials.TESTPort()
};

class SSH {
  constructor(options) {
    this.connection = null;
    this.options = options;
    this.connection = require('./lib/index.js')(this.options);
    this.connection.on('stderr', function(err) { console.log("Error on StdErr",err); });
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.connection.on('closed', reject);
      this.connection.on('connected',(host) => {
        this.connection.removeListener('closed', reject);
        resolve('Connected to host:', host);
      });
      this.connection.connect();
    });
  }
  write(value) {
    return new Promise((resolve, reject) => {
      this.connection.on('output', (data,lastChunk) => {
	      if (data) {
		      if (data.match("pwd")) {
            console.log("Command data->",data);
		      } else {
            console.log("Output data->",data);
            resolve('Saw output data');
          }
	      }
      });
      this.connection.write(value);
    });

  }
  disconnect() {
    return new Promise((resolve, reject) => {
      this.connection.once('closed', function(addr,err) {
	      if (err) {
		      reject("Error on session",err);
	      } else {
          resolve("SSH Session has being closed.");
        }
      });
      this.connection.close();
    })

  }
}

var mySSH = new SSH(options);
mySSH.connect()
  .then((string) => {
    console.log(string)
    return mySSH.write('pwd');
  })
  .then((string) => {
    return mySSH.disconnect();
  }).then((string) => {
    console.log(string)
  });


