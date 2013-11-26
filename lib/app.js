var flatiron = require('flatiron'),
    workspace = require('./workspace'),
    fipassport = require('flatiron-passport'),
    routes = require('../routes'),
    root = require('../public'),
    app = flatiron.app;

app.use(flatiron.plugins.http);
app.use(fipassport);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.status(401);
  res.json({msg: "Please login first!"});
}
app.router.get("/", root.home.page);
for(var r in routes){
    var route = routes[r];
    if(!routes.hasOwnProperty(r)) continue;
    for(var method in route){
        if(!route.hasOwnProperty(method)) continue;
        app.router.get(r,route[method]);
    }
}
app.router.get('/auth/github', fipassport.authenticate('github'), function(req, res) {});
app.router.get('/auth/github/callback',
  fipassport.authenticate('github', { failureRedirect: '/'}),
  function(req, res) {
    res.redirect('/#/dashboard');
  });

app.router.get('/logout', function(req, res){
  req.logout();
  res.json('OK');
});
// API
app.router.get('/workspace', ensureAuthenticated, workspace.list);
app.router.post('/workspace', ensureAuthenticated, workspace.create);
app.router.get('/workspace/:name', ensureAuthenticated, workspace.run);
app.router.post('/workspace/:name/keepalive', ensureAuthenticated, workspace.keepAlive);
app.router.delete('/workspace/:name', ensureAuthenticated, workspace.destroy);

    // app.router.get('/', function () {
    //     this.res.json({ 'hello': 'world' });
    // });

exports.start = function(app, appconfig, addr, fipassport){

    app.start(appconfig.get('server:svrPort')|| process.env.PORT, 
        function(err){
            if(err){
                throw err;
            }
            app.log.info('Starting ironhub Server');
            var addr = app.server.address();
            app.log.info('Ironhub server listening on ' + addr.address + ':' + addr.port);
            return addr;
    });
    return addr;
};