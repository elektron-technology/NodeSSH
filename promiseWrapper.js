'use strict';
const shellEscape = require('shell-escape');

class SSH {
  constructor(options) {
    this.connected = false;
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
        this.connected = true;
        resolve('Connected to host:', host);
      });
      this.connection.connect();
    });
  }
  execCommand(value, options) {
    return new Promise((resolve, reject) => {
      if (options.cwd) {
        value = `cd ${shellEscape([options.cwd])} 1> /dev/null 2> /dev/null; ${value}`;
      }
      var wholeLine = '';
      this.connection.on('output', (data,lastChunk) => {
	      if (data) {
          wholeLine += data;
        } else {
          if (lastChunk === true) {
            this.connection.removeAllListeners('output');
            if (wholeLine.indexOf(value) !== -1) {
              console.log('$', value);
              var res = wholeLine.replace(value, '');
            } else {
              console.error(`Expected ${value} to be present in ${wholeLine}`);
            }
            var result = {};
            result.stdout = res;
            resolve(result);
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
          this.connection = null;
          resolve("SSH Session has being closed.");
        }
      });
      this.connection.close();
    })

  }
}

module.exports = SSH;
