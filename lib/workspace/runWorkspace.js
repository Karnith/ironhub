var path = require('path'),
    spawn = require('child_process').spawn;

var respondInvalidWorkspace = function(res) {
  res.status(400);
  res.json({msg: "Invalid workspace name"});
};
var createWorkspaceKillTimeout = function(workspaceProcess, workspaceName) {
  var timeout = setTimeout(function() {
    process.kill(-workspaceProcess.pid, 'SIGTERM');
    console.info("Killed workspace " + workspaceName);
   }, 900000); //Workspaces have a lifetime of 15 minutes

   return timeout;
};

/*
* GET run a workspace
*/
 exports.run = function(req, res) {
  var potentiallyBadPathName = req.params.name.split(path.sep);
  var workspaceName = potentiallyBadPathName[potentiallyBadPathName.length-1];

  if(workspaceName === '..') {
    respondInvalidWorkspace(res);
    return;
  }

   console.log("Starting " + __dirname + '/../../c9/bin/cloud9.sh for workspace ' + workspaceName + " on port " + req.nextFreePort);

   var workspace = spawn(__dirname + '/../../c9/bin/cloud9.sh', ['-w', __dirname + '/../workspaces/' + req.user + '/' + workspaceName, '-l', 'njsdev.jcmar.com', '-p', req.nextFreePort], {detached: true});
   workspace.stderr.on('data', function (data) {
     console.log('stdERR: ' + data);
   });

   req.app.get('runningWorkspaces')[req.user + '/' + workspaceName] = {
     killTimeout: createWorkspaceKillTimeout(workspace, workspaceName),
     process: workspace,
     name: workspaceName
   };

   res.json({msg: "Successfully started workspace", url: req.app.settings.baseUrl + ":" + req.nextFreePort});
 };

/*
* POST to keep the workspace alive
*/
 exports.keepAlive = function(req, res) {
   var workspace = req.app.get('runningWorkspaces')[req.user + '/' + req.params.name];
   clearTimeout(workspace.killTimeout);
   workspace.killTimeout = createWorkspaceKillTimeout(workspace.process, workspace.name);
   res.send();
 };