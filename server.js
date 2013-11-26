var flatiron = require('flatiron'),
    server = require('./lib/app.js'),
    path = require('path'),
    auth = require('./lib/auth'),
    fipassport = require('flatiron-passport'),
    fs = require('fs'),
    app = flatiron.app,
    appconfig = app.config.file({ file: path.join(__dirname, './config', 'config.json') });


server.start(app, appconfig);
var addr = app.server.address();

auth.github.githubAuth(app, appconfig, fs, path, fipassport, addr);

