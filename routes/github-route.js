exports.github = function(response) {
	console.log("Request handler 'github' was called.");
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<h1 class="centered">Welcome to Cloud9Hub!</h1>'+
    '<p class="centered">'+
    '<a class="topcoat-button--large" href="/auth/github">Sign in with Github</a>'+
    '</p>'+
	'</body>'+
	'</html>';
	this.res.writeHead(200, {"Content-Type": "text/html"});
	this.res.write(body);
	this.res.end();
};
