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

// Vague incomplete spec file, should be mocha ified
var mySSH = new SSH(options);
mySSH.connect()
  .then((string) => {
    console.log(string);
    return mySSH.execCommand('pwd', {});
  })
  .then((result) => {
    console.log(result.stdout);
    var options = {};
    options.cwd = '/usr';
    return mySSH.execCommand('ls', options);
  })
  .then((result) => {
    console.log(result.stdout);
    return mySSH.disconnect();
  }).then((string) => {
    console.log(string);
  });
