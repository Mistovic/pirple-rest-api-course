/*
 * Primary file for API
 */

// ---- Dependancies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const _data = require("./lib/data");
const _handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

// The server should respond to all server req with a string
// -- ! This function instances the server
const httpServer = http.createServer((req, res) => {
	unifiedServer(req, res);
});

// -- ! This starting the server
httpServer.listen(config.httpPort, function () {
	console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " mode.");
});

// Instanciate HTTPS server
var httpsServerOptions = {
	key: fs.readFileSync("./https/key.pem"),
	cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServer(req, res);
});

// Start HTTPS server
httpsServer.listen(config.httpsPort, function () {
	console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " mode.");
});

// All the server logic for both htp and https servers
var unifiedServer = function (req, res) {
	// Parsing Query String - Get the url and parse it
	const parsedUrl = url.parse(req.url, true);

	// Parsing Query String - Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, "");

	console.log(req.url, trimmedPath);
	// Parsing Query String - Get the query string as an object
	const queryStringObj = parsedUrl.query;

	// Parsing Headers - Get the HTTP Method
	const method = req.method.toUpperCase();

	// Parsing Headers - Parsing Headers - Get the headers as an object
	const headers = req.headers;

	// Parsing Payload - Get the payload if any - (Dealing with streams)
	const decoder = new StringDecoder("utf-8");
	let buffer = "";

	req.on("data", function (data) {
		console.log("On DATA evetn: ", data);
		buffer += decoder.write(data);
	});

	req.on("end", function () {
		buffer += decoder.end();

		// Choose the handler this req shoud go to
		// if one is not found use not found
		let choosenHandler = typeof router[trimmedPath] !== "undefined" ? router[trimmedPath] : _handlers.notFound;

		// Construct data object to send to the handlers
		let data = {
			trimmedPath: trimmedPath,
			queryStringObj: queryStringObj,
			method: method,
			headers: headers,
			payload: helpers.parseToJson(buffer),
		};

		// Route the request to the handler specified in the router
		choosenHandler(data, function (statusCode, payload) {
			// Default status code
			statusCode = typeof statusCode == "number" ? statusCode : 200;

			console.log("Payload in Choosen handler: ", payload)

			// use the payload called by the handler or default empty obj
			payload = typeof payload == "object" ? payload : {};

			// onvert payload to string
			let payloadString = JSON.stringify(payload);

			// Return response
			res.setHeader("Content-type", "application/json");
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the request path
			console.log("Payload ", payloadString, statusCode);
		});
	});
};

// Defining a request router
let router = {
	ping: _handlers.ping,
	users: _handlers.users,
	notFound: _handlers.notFound,
};
