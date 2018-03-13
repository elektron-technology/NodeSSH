'use strict';

var credentials = require('./DONOTCOMMIT.js')();
var options = {
  host: credentials.TESTHost(),
  username: credentials.TESTUser(),
  password: credentials.TESTPass(),
  port: credentials.TESTPort(),
  colors: true
};

const SSH = require('./promiseWrapper');

describe('Wrapper sanity check', function(done) {
  this.timeout(10000);

  it('should connect to a hub, run a command and disconnect', function() {
    var mySSH = new SSH(options);
    mySSH.connect()
      .then((result) => {
        var options = {};
        options.cwd = '/usr';
        return mySSH.execCommand('ls', options);
      })
      .then((result) => {
        console.log(result.stdout);
        //assert(result.stdout === 'bin    local  sbin   share');
        return mySSH.disconnect();
      }).then((string) => {
        assert(string === 'SSH session has been closed.');
        console.log(string);
        done();
      });
  })
});
