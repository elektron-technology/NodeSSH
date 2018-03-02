var credentials = require('./DONOTCOMMIT.js')();
var options = {
  host: credentials.TESTHost(),
  username: credentials.TESTUser(),
  password: credentials.TESTPass(),
  port: credentials.TESTPort()
};

// var connect = (options) => {

//   return new Promise((resolve, reject) => {
//     var SSHClient = require('./lib/index.js')(options);
//     SSHClient.on('stderr', function(err) { console.log("Error on StdErr",err); });
//     SSHClient.on('output', function(data,lastChunk) { 
// 	    if (lastChunk == true) {
// 		    console.log("Should close connection");
// 		    SSHClient.close();
// 	    }
// 	    if (data) {
// 		    if (data.match("pwd")) { console.log("Command data->",data);
// 		                           }else { console.log("Output data->",data); }
// 	    }
//     });
//     //Connection
//     SSHClient.once('closed', function(addr,err) { 
// 	    if (err) {
// 		    console.log("Error on session",err); 
// 	    }else { console.log("SSH Session has being closed."); }
//     });
//     SSHClient.on('connected',(host) => {
//       console.log('Were Connected',host);
//       SSHClient.write('pwd');
//       resolve()
//     });
//     SSHClient.connect();
//     //  resolve('uh connected I think')
//   });
// };

// connect(options).then((string) => {
//   console.log('amazing');
//   console.log(string);
// });


class SSH {
  constructor(options) {
    this.connection = null;
    this.options = options;
    this.connection = require('./lib/index.js')(this.options);
    this.connection.on('stderr', function(err) { console.log("Error on StdErr",err); });
    this.connection.once('closed', function(addr,err) {
	    if (err) {
		    console.log("Error on session",err);
	    }else { console.log("SSH Session has being closed."); }
    });
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.connection.on('closed', reject);
      this.connection.on('connected',(host) => {
        this.connection.removeListener('closed', reject);
        console.log('Were Connected',host);
        resolve();
      });
      this.connection.connect();
    });
  }
  write(value) {
    return new Promise((resolve, reject) => {
      console.log('in promise')
      this.connection.on('output', (data,lastChunk) => {
        console.log('in event')
	      if (data) {
		      if (data.match("pwd")) {
            console.log("Command data->",data);
		      }else {
            console.log("Output data->",data);
            resolve();
          }
	      }
      });
      this.connection.write(value);
    });

  }
  disconnect() {
    this.connection.close();
  }
}


var mySSH = new SSH(options);
mySSH.connect()
  .then((string) => {
    mySSH.write('pwd');
  })
  .then((string) => {
    mySSH.disconnect();
  });




//connect(options).

// class SSH {
//     connection: ?SSH2
//     constructor() {
//         this.connection = null
//     }
//     connect(givenConfig: ConfigGiven): Promise<this> {
//         const connection = new SSH2()
//         this.connection = connection
//         return new Promise(function(resolve) {
//             resolve(Helpers.normalizeConfig(givenConfig));
//         }).then(
//             config =>
//                 new Promise((resolve, reject) => {
//                     connection.on('error', reject);
//                     if (config.onKeyboardInteractive) {
//                         connection.on('keyboard-interactive', config.onKeyboardInteractive);
//                     }
//                     connection.on('ready', () => {
//                         connection.removeListener('error', reject);
//                         resolve(this);
//                     });
//                     connection.on('end', () => {
//                         if (this.connection === connection) {
//                             this.connection = null;
//                         }
//                     });
//                     connection.connect(config);
//                 }),
//         )
//     }

