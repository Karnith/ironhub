var GithubStrategy = require('passport-github').Strategy;
exports.githubAuth = function(app, appconfig, fs, path, fipassport, addr){
    // app.log.info('Using git authentication');
    fipassport.use(new GithubStrategy({
        clientID: appconfig.get("github:GITHUB_CLIENT_ID"),
        clientSecret: appconfig.get("github:GITHUB_CLIENT_SECRET"),
        // callbackURL: app.get('baseUrl') + ':' + app.get('port') + '/auth/github/callback'
        callbackURL: addr.address + ':' + addr.port + '/auth/github/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        var username = path.basename(profile.username.toLowerCase());
        if(!fs.existsSync(__dirname + '/workspaces/' + path.basename(username))) {
          if(appconfig.get("github:PERMITTED_USERS") !== false && appconfig.get("github:PERMITTED_USERS").indexOf(username)) return done('Sorry, not allowed :(', null);
    
          //Okay, that is slightly unintuitive: fs.mkdirSync returns "undefined", when successful..
          if(fs.mkdirSync(__dirname + '/workspaces/' + path.basename(username), '0700') !== undefined) {
            return done("Cannot create user", null);
          } else {
            return done(null, username);
          }
        }
        return done(null, username);
      }
    ));
};