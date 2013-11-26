exports.page = function(response) {
	console.log("Request handler 'home' was called.");
	var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<h1 class="centered">Welcome to ironhub!</h1>'+
    '<p class="centered">'+
    '<a class="topcoat-button--large" href="/auth/github">choose how to sign in.</a>'+
    '</p>'+
	'</body>'+
	'</html>';
	this.res.writeHead(200, {"Content-Type": "text/html"});
	this.res.write(body);
	this.res.end();
};