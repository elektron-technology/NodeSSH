
'use strict';

const shellEscape = require('shell-escape');
const debug = require('debug')('promiseWrapper')

class SSH {
  // new SSH(options: host, username, password): Promise<this>
  constructor(options) {
    this.connected = false;
    this.connection = null;
    this.options = options;
    this.connection = require('./lib/index.js')(this.options);
    this.connection.on('stderr', function(err) { console.error('Error on StdErr',err); });
  }

  //  connect(): Promise<this>

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.on('closed', reject);
      this.connection.on('connected',(host) => {
        debug('Connecting to host:', host);
        this.connection.removeListener('closed', reject);
        this.connected = true;
        resolve('Connected to host:', host);
      });
      this.connection.connect();
    });
  }


  // execCommand(command: string, options: { cwd: string, stdin: string } = {}): Promise<{ stdout: string}>
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
              debug('$', value);
              var res = wholeLine.replace(value, '');
            } else {
              console.error(`Expected ${value} to be present in ${wholeLine}`);
            }
            var result = {};
            result.stdout = res;
            debug(res);
            resolve(result);
	        }
        }
      });
      this.connection.write(value);
    });

  }

  // disconnet(): Promise<this>
  dispose() {
    return new Promise((resolve, reject) => {
      if (this.connection.connected === false) {
        debug('Attempted to close defunct SSH connection');
        resolve('SSH session already closed');
        return;
      }
      this.connection.on('closed', function(addr,err) {
	      if (err) {
          debug('Error on SSH closed event!');
          throw TypeError("issues");
          reject();
	      } else {
          this.connected = false;
          debug('ssh session has been closed');
          resolve('SSH session has being closed.');
        }
      });
      this.connection.close();
    });
  }
}

module.exports = SSH;